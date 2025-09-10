package com.sam.InsuranceManagement.BO;

import com.sam.InsuranceManagement.DAO.CoverageRepository;
import com.sam.InsuranceManagement.DAO.CustomerRepository;
import com.sam.InsuranceManagement.DAO.PolicyRepository;
import com.sam.InsuranceManagement.DAO.PolicyTypeRepository;
import com.sam.InsuranceManagement.DTO.policy.PolicyRequestDTO;
import com.sam.InsuranceManagement.DTO.policy.PolicyResponseDTO;
import com.sam.InsuranceManagement.Entity.Coverage;
import com.sam.InsuranceManagement.Entity.Customer;
import com.sam.InsuranceManagement.Entity.Policy;
import com.sam.InsuranceManagement.Entity.PolicyType;
import com.sam.InsuranceManagement.Exception.PolicyException;
import com.sam.InsuranceManagement.Projection.PolicyBasicInfo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class PolicyBO {

    private final PolicyRepository repository;
    private final CustomerRepository customerRepository;
    private final CoverageRepository coverageRepository;
    private final PolicyTypeRepository policyTypeRepository;

    private static final String POLICY_PREFIX = "POL";
    private static final long INITIAL_SEQUENCE = 1001; // Restored this, as it's the starting point.

    // === Add Policy ===
    public PolicyResponseDTO addPolicy(PolicyRequestDTO dto) throws PolicyException {
        // Step 1: Generate the sequential policy number
        String generatedPolicyNumber = generateUniquePolicyNumber();

        // Step 2: Map DTO to entity, and then set the generated policy number
        Policy policy = mapRequestToEntity(dto);
        policy.setPolicyNumber(generatedPolicyNumber); // Set the generated number here

        // Step 3: Validate and save
        validatePolicy(policy);
        policy = repository.save(policy);
        return mapEntityToResponse(policy);
    }

    // === REVISED HELPER METHOD: Generate Exact Next Sequential Policy Number ===
    // This method now correctly calls the repository method that numerically sorts
    // and is more robust against existing non-sequential policy numbers using regex.
    private String generateUniquePolicyNumber() {
        // CRITICAL CHANGE: Use the specific query method that returns Optional<String>
        // and sorts numerically from PolicyRepository.
        Optional<String> lastPolicyNumberOptional = repository.findTopByPolicyNumberStartingWithPOLOrderByPolicyNumberDesc();

        long nextNumericPart = INITIAL_SEQUENCE; // Default starting number

        if (lastPolicyNumberOptional.isPresent()) {
            String lastPolicyNumber = lastPolicyNumberOptional.get();
            // Use regex to robustly extract the numeric part if it follows the POLXXXX format
            Pattern pattern = Pattern.compile("^" + POLICY_PREFIX + "(\\d+)$"); // Matches POL followed by one or more digits
            Matcher matcher = pattern.matcher(lastPolicyNumber);

            if (matcher.matches()) { // If the last policy number matches our expected POLXXXX pattern
                try {
                    String numericPartStr = matcher.group(1); // Extract the numeric group (the digits)
                    long lastNumeric = Long.parseLong(numericPartStr);
                    nextNumericPart = lastNumeric + 1;
                } catch (NumberFormatException e) {
                    // This catches if the extracted numeric part is not a valid number (shouldn't happen with \d+ but for safety)
                    System.err.println("Warning: Could not parse numeric part '" + matcher.group(1) + "' from policy number '" + lastPolicyNumber + "'. Falling back to " + INITIAL_SEQUENCE + ". Error: " + e.getMessage());
                    nextNumericPart = INITIAL_SEQUENCE; // Fallback
                }
            } else {
                // This means the last policy number from the database did not match the expected POLXXXX format
                // (e.g., it was one of the POL2025... timestamped ones from your images)
                System.err.println("Warning: Last policy number from DB '" + lastPolicyNumber + "' does not match expected '" + POLICY_PREFIX + "XXXX' format. Starting from " + INITIAL_SEQUENCE + ".");
                nextNumericPart = INITIAL_SEQUENCE; // Fallback
            }
        }
        // Format the next number with "POL" prefix and 4-digit padding (e.g., POL0001, POL1001)
        return String.format(POLICY_PREFIX + "%04d", nextNumericPart);
    }


    // === GetById ===
    public PolicyResponseDTO getPolicyById(int id) throws PolicyException {
        Policy policy = repository.findById(id)
                .orElseThrow(() -> new PolicyException("Policy not found with ID: " + id));
        return mapEntityToResponse(policy);
    }

    // === GetAll ===
    public List<PolicyResponseDTO> getAllPolicies() throws PolicyException {
        // THIS LINE HAS BEEN UPDATED TO USE findAllWithCustomerAndCity()
        List<Policy> policies = repository.findAllWithCustomerAndCity();
        if (policies.isEmpty()) {
            throw new PolicyException("No policies found.");
        }
        return policies.stream().map(this::mapEntityToResponse).collect(Collectors.toList());
    }

    // === Get By CustomerId ===
    public List<PolicyResponseDTO> getPoliciesByCustomerId(int customerId) throws PolicyException {
        List<Policy> policies = repository.findByCustomerCustomerId(customerId);
        if (policies.isEmpty()) {
            throw new PolicyException("No policies found for Customer ID: " + customerId);
        }
        return policies.stream().map(this::mapEntityToResponse).collect(Collectors.toList());
    }

    // ===== JPQL Queries ======

    // Fetch policies with premium above the given amount
    public List<PolicyResponseDTO> getPoliciesWithPremiumGreaterThan(double premium) throws PolicyException {
        List<Policy> policies = repository.findByPremiumGreaterThan(premium);
        if (policies.isEmpty()) {
            throw new PolicyException("No policies found with premium greater than " + premium);
        }
        return policies.stream().map(this::mapEntityToResponse).collect(Collectors.toList());
    }

        // Get all policies created between two dates
        public List<PolicyResponseDTO> getPoliciesByCreatedDateRange(Date startDate, Date endDate) throws PolicyException {
            List<Policy> policies = repository.findPoliciesByCreatedDateBetween(startDate, endDate);
            if (policies.isEmpty()) {
                throw new PolicyException("No policies found between given dates.");
            }
            return policies.stream().map(this::mapEntityToResponse).collect(Collectors.toList());
        }

    // === Get Policies by Customer First Name ===
    public List<PolicyResponseDTO> getPoliciesByCustomerName(String name) throws PolicyException {
        List<Policy> policies = repository.findByCustomerFirstNameIgnoreCase(name);
        if (policies.isEmpty()) {
            throw new PolicyException("No policies found for customer name: " + name);
        }
        return policies.stream().map(this::mapEntityToResponse).collect(Collectors.toList());
    }

    // === Get Policies By Customer Gender ===
    public List<PolicyResponseDTO> getPoliciesByCustomerGender(char gender) throws PolicyException {
        List<Policy> policies = repository.findPoliciesByCustomerGender(gender);
        if (policies.isEmpty()) {
            throw new PolicyException("No policies found for customers with gender: " + gender);
        }
        return policies.stream().map(this::mapEntityToResponse).collect(Collectors.toList());
    }

    // === Get Policies by Customer City ===
    public List<PolicyResponseDTO> getPoliciesByCustomerCity(String cityName) throws PolicyException {
        // This method call must align with the name in PolicyRepository.
        List<Policy> policies = repository.findByCustomerCityNameIgnoreCase(cityName);
        if (policies.isEmpty()) {
            throw new PolicyException("No policies found for city: " + cityName);
        }
        return policies.stream().map(this::mapEntityToResponse).collect(Collectors.toList());
    }

    // === Validation ===
    private void validatePolicy(Policy policy) throws PolicyException {
        if (policy.getPolicyNumber() == null || policy.getPolicyNumber().isEmpty()) {
            throw new PolicyException("Policy number cannot be blank.");
        }
        if (policy.getPremium() <= 0) {
            throw new PolicyException("Premium must be greater than zero.");
        }
        if (policy.getCoverage() == null) throw new PolicyException("Coverage is required.");
        if (policy.getPolicyType() == null) throw new PolicyException("Policy Type is required.");
        if (policy.getCustomer() == null) throw new PolicyException("Customer is required.");
    }

    // === Mapper: Request -> Entity ===
    private Policy mapRequestToEntity(PolicyRequestDTO dto) throws PolicyException {
        Coverage coverage = coverageRepository.findById(dto.getCoverageId())
                .orElseThrow(() -> new PolicyException("Coverage not found with ID: " + dto.getCoverageId()));
        PolicyType policyType = policyTypeRepository.findById(dto.getPolicyTypeId())
                .orElseThrow(() -> new PolicyException("Policy Type not found with ID: " + dto.getPolicyTypeId()));
        Customer customer = customerRepository.findById(dto.getCustomerId())
                .orElseThrow(() -> new PolicyException("Customer not found with ID: " + dto.getCustomerId()));

        Policy policy = new Policy();
        policy.setPremium(dto.getPremium());
        policy.setCoverage(coverage);
        policy.setPolicyType(policyType);
        policy.setCustomer(customer);
        return policy;
    }

    // === Mapper: Entity -> Response ===
    private PolicyResponseDTO mapEntityToResponse(Policy policy) {
        PolicyResponseDTO dto = new PolicyResponseDTO();
        dto.setPolicyId(policy.getPolicyId());
        dto.setPolicyNumber(policy.getPolicyNumber());
        dto.setPremium(policy.getPremium());
        dto.setCoverageId(policy.getCoverage().getCoverageId());
        dto.setPolicyTypeId(policy.getPolicyType().getTypeId());
        dto.setCustomerId(policy.getCustomer().getCustomerId());

        // --- THESE LINES POPULATE CUSTOMER DETAILS ---
        if (policy.getCustomer() != null) {
            Customer customer = policy.getCustomer();
            dto.setCustomerFirstName(customer.getFirstName());
            dto.setCustomerLastName(customer.getLastName());
            dto.setCustomerMobileNumber(customer.getMobileNumber());
            // Ensure City object is not null before trying to get its name
            dto.setCustomerCityName(customer.getCity() != null ? customer.getCity().getCityName() : null);
        }
        // --- END ADDITION ---

        dto.setCreatedDate(
                policy.getCreatedDate() != null
                        ? new SimpleDateFormat("yyyy-MM-dd HH:mm:ss", java.util.Locale.US).format(policy.getCreatedDate())
                        : null
        );
        dto.setUpdatedDate(
                policy.getUpdatedDate() != null
                        ? new SimpleDateFormat("yyyy-MM-dd HH:mm:ss", java.util.Locale.US).format(policy.getUpdatedDate())
                        : null
        );
        return dto;
    }

    // ==== projection =====
    public List<PolicyBasicInfo> fetchBasicPolicyInfo() throws PolicyException {
        List<PolicyBasicInfo> list = repository.fetchBasicPolicyInfo();
        if (list.isEmpty()) {
            throw new PolicyException("No basic policy info found.");
        }
        return list;
    }

    // Aggregate function ====
    public Long countPolicies() {
        return repository.countTotalPolicies();
    }

    public Double getTotalPremium() {
        return repository.sumAllPremiums();
    }

    public List<Object[]> getPolicyCountByCity() {
        return repository.countPoliciesByCity();
    }
}