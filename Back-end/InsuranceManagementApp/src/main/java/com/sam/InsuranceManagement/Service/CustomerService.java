package com.sam.InsuranceManagement.Service;

import com.sam.InsuranceManagement.BO.CustomerBO;
import com.sam.InsuranceManagement.DTO.customer.CustomerRequestDTO;
import com.sam.InsuranceManagement.DTO.customer.CustomerResponseDTO;
import com.sam.InsuranceManagement.Entity.Customer;
import com.sam.InsuranceManagement.Exception.CustomerException;
import com.sam.InsuranceManagement.Response.ResponseObject;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;
import java.util.Locale;

@Service
@Slf4j
@RequiredArgsConstructor
public class CustomerService {

    private static final String ERROR_PREFIX = "Error: ";
    private static final String SUCCESS_FETCH = "Customers fetched successfully";

    private final CustomerBO bo;

    public ResponseObject addCustomer(CustomerRequestDTO dto) {
        ResponseObject response = new ResponseObject();
        try {
            Customer customer = bo.addCustomer(dto);
            response.setSuccessMessage("Customer added successfully");
            response.setCustomerDTO(mapToDTO(customer));
            log.info("Customer added successfully: {}", customer.getCustomerId());
        } catch (CustomerException e) {
            response.setFailureMessage(ERROR_PREFIX + e.getMessage());
            log.error("Error in addCustomer", e);
        }
        return response;
    }

    public ResponseObject updateCustomer(int id, CustomerRequestDTO dto) {
        ResponseObject response = new ResponseObject();
        try {
            Customer updatedCustomer = bo.updateCustomer(id, dto);
            response.setSuccessMessage("Customer updated successfully");
            response.setCustomerDTO(mapToDTO(updatedCustomer));
            log.info("Customer updated successfully: {}", updatedCustomer.getCustomerId());
        } catch (CustomerException e) {
            response.setFailureMessage(ERROR_PREFIX + e.getMessage());
            log.error("Error in updateCustomer", e);
        }
        return response;
    }

    public ResponseObject getAllCustomers() {
        ResponseObject response = new ResponseObject();
        try {
            List<Customer> customers = bo.getAllCustomers();
            response.setCustomerListDTO(customers.stream().map(this::mapToDTO).toList());
            response.setSuccessMessage(SUCCESS_FETCH);
            log.info("Fetched {} customers", customers.size());
        } catch (CustomerException e) {
            response.setFailureMessage("Error fetching customers: " + e.getMessage());
            log.error("Error in getAllCustomers", e);
        }
        return response;
    }

    @Transactional
    public ResponseObject getCustomerById(int id) {
        ResponseObject response = new ResponseObject();
        try {
            Customer customer = bo.getCustomerById(id);
            response.setCustomerDTO(mapToDTO(customer));
            response.setSuccessMessage("Customer fetched by ID successfully");
            log.info("Fetched customer by ID: {}", id);
        } catch (CustomerException e) {
            response.setFailureMessage("Error fetching customer: " + e.getMessage());
            log.error("Error in getCustomerById", e);
        }
        return response;
    }

    public ResponseObject getCustomersByCityName(String cityName) {
        ResponseObject response = new ResponseObject();
        try {
            List<Customer> customers = bo.getCustomersByCityName(cityName);
            response.setCustomerListDTO(customers.stream().map(this::mapToDTO).toList());
            response.setSuccessMessage(SUCCESS_FETCH);
            log.info("Fetched {} customers from city: {}", customers.size(), cityName);
        } catch (CustomerException e) {
            response.setFailureMessage(ERROR_PREFIX + e.getMessage());
            log.error("Error in getCustomersByCityName", e);
        }
        return response;
    }

    public ResponseObject getCustomersByGender(char gender) {
        ResponseObject response = new ResponseObject();
        try {
            List<Customer> customers = bo.getCustomersByGender(gender);
            response.setCustomerListDTO(customers.stream().map(this::mapToDTO).toList());
            response.setSuccessMessage(SUCCESS_FETCH);
            log.info("Fetched {} customers with gender: {}", customers.size(), gender);
        } catch (CustomerException e) {
            response.setFailureMessage(ERROR_PREFIX + e.getMessage());
            log.error("Error in getCustomersByGender", e);
        }
        return response;
    }

    public ResponseObject getCustomersBornBefore(LocalDate date) {
        ResponseObject response = new ResponseObject();
        try {
            Date dobDate = Date.from(date.atStartOfDay(ZoneId.systemDefault()).toInstant());
            List<Customer> customers = bo.getCustomersBornBefore(dobDate);
            response.setCustomerListDTO(customers.stream().map(this::mapToDTO).toList());
            response.setSuccessMessage(SUCCESS_FETCH);
            log.info("Fetched customers born before {}", date);
        } catch (Exception e) {
            response.setFailureMessage(ERROR_PREFIX + e.getMessage());
            log.error("Error in getCustomersBornBefore", e);
        }
        return response;
    }

    public ResponseObject getCustomerCountByCity(String cityName) {
        ResponseObject response = new ResponseObject();
        try {
            long count = bo.getCustomerCountByCityName(cityName);
            response.setCustomerCount(count);
            response.setSuccessMessage("Count fetched successfully");
            log.info("Customer count in city '{}': {}", cityName, count);
        } catch (CustomerException e) {
            response.setFailureMessage(ERROR_PREFIX + e.getMessage());
            log.error("Error in getCustomerCountByCity", e);
        }
        return response;
    }

    public ResponseObject getCustomersWithPremiumAbove(double amount) {
        ResponseObject response = new ResponseObject();
        try {
            List<Customer> customers = bo.getCustomersWithPremiumAbove(amount);
            response.setCustomerListDTO(customers.stream().map(this::mapToDTO).toList());
            response.setSuccessMessage(SUCCESS_FETCH);
            log.info("Fetched {} customers with premium above {}", customers.size(), amount);
        } catch (CustomerException e) {
            response.setFailureMessage(ERROR_PREFIX + e.getMessage());
            log.error("Error in getCustomersWithPremiumAbove", e);
        }
        return response;
    }

    public ResponseObject getCustomersByPolicyType(String typeName) {
        ResponseObject response = new ResponseObject();
        try {
            List<Customer> customers = bo.getCustomersByPolicyType(typeName);
            response.setCustomerListDTO(customers.stream().map(this::mapToDTO).toList());
            response.setSuccessMessage("Found customers with policy type " + typeName);
            log.info("Fetched {} customers with policy type: {}", customers.size(), typeName);
        } catch (CustomerException e) {
            response.setFailureMessage(e.getMessage());
            log.error("Error in getCustomersByPolicyType", e);
        }
        return response;
    }

    public ResponseObject getCustomersByOccupationId(int occupationId) {
        ResponseObject response = new ResponseObject();
        try {
            List<Customer> customers = bo.getCustomersByOccupationId(occupationId);
            response.setCustomerListDTO(customers.stream().map(this::mapToDTO).toList());
            response.setSuccessMessage("Customers fetched successfully by occupation ID");
            log.info("Fetched {} customers with occupationId: {}", customers.size(), occupationId);
        } catch (CustomerException e) {
            response.setFailureMessage("Error fetching customers: " + e.getMessage());
            log.error("Error in getCustomersByOccupationId", e);
        }
        return response;
    }

    @Transactional
    public ResponseObject getCustomersBornAfter(LocalDate date) {
        ResponseObject response = new ResponseObject();
        try {
            Date dateAsDate = java.sql.Date.valueOf(date);
            List<Customer> customers = bo.getCustomersBornAfter(dateAsDate);
            response.setCustomerListDTO(customers.stream().map(this::mapToDTO).toList());
            response.setSuccessMessage("Customers who were born after " + date + " fetched successfully");
            log.info("Fetched {} customers born after {}", customers.size(), date);
        } catch (CustomerException e) {
            response.setFailureMessage(e.getMessage());
            log.error("Error in getCustomersBornAfter", e);
        }
        return response;
    }

    @Transactional(readOnly = true)
    public ResponseObject getCustomersWithNoPolicies() {
        ResponseObject response = new ResponseObject();
        try {
            List<Customer> customers = bo.getCustomersWithNoPolicies();
            response.setCustomerListDTO(customers.stream().map(this::mapToDTO).toList());
            response.setSuccessMessage("Customers without policies fetched successfully");
            log.info("Fetched {} customers without policies", customers.size());
        } catch (CustomerException e) {
            response.setFailureMessage(e.getMessage());
            log.error("Error in getCustomersWithNoPolicies", e);
        }
        return response;
    }

    private CustomerResponseDTO mapToDTO(Customer customer) {
        CustomerResponseDTO dto = new CustomerResponseDTO();
        dto.setCustomerId(customer.getCustomerId());
        dto.setFirstName(customer.getFirstName());
        dto.setLastName(customer.getLastName());
        dto.setGender(customer.getGender());
        dto.setDob(new SimpleDateFormat("yyyy-MM-dd", Locale.US).format(customer.getDob()));
        dto.setMobileNumber(customer.getMobileNumber());
        dto.setCityName(customer.getCity().getCityName());
        dto.setStateId(customer.getStateId());
        dto.setCountryId(customer.getCountryId());
        dto.setOccupationId(customer.getOccupationId());
        dto.setCreatedDate(customer.getCreatedDate() != null ? customer.getCreatedDate().toString() : null);
        dto.setUpdatedDate(customer.getUpdatedDate() != null ? customer.getUpdatedDate().toString() : null);
        return dto;
    }
}
