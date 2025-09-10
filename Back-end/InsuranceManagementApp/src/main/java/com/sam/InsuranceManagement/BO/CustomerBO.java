package com.sam.InsuranceManagement.BO;

import com.sam.InsuranceManagement.DAO.CityRepository;
import com.sam.InsuranceManagement.DAO.CustomerRepository;
import com.sam.InsuranceManagement.DTO.customer.CustomerRequestDTO;
import com.sam.InsuranceManagement.Entity.Customer;
import com.sam.InsuranceManagement.Exception.CustomerException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;

@Component
@RequiredArgsConstructor
public class CustomerBO {

    private final CustomerRepository customerRepository;
    private final CityRepository cityRepository;

    public Customer addCustomer(CustomerRequestDTO dto) throws CustomerException {
        Customer customer = mapDtoToEntity(dto);
        validateCustomer(customer);
        return customerRepository.save(customer);
    }

    public Customer getCustomerById(int id) throws CustomerException {
        return customerRepository.findById(id)
                .orElseThrow(() -> new CustomerException("Invalid customer ID."));
    }

    public List<Customer> getAllCustomers() throws CustomerException {
        List<Customer> customers = customerRepository.findAll();
        if (customers.isEmpty()) {
            throw new CustomerException("No customers found.");
        }
        return customers;
    }

    public Customer updateCustomer(int id, CustomerRequestDTO dto) throws CustomerException {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new CustomerException("Customer not found with ID: " + id));

        updateEntityFromDto(customer, dto);
        validateCustomer(customer);

        return customerRepository.save(customer);
    }

    // === Mapping methods ===

    private Customer mapDtoToEntity(CustomerRequestDTO dto) throws CustomerException {
        Customer customer = new Customer();
        updateEntityFromDto(customer, dto);
        return customer;
    }

    private void updateEntityFromDto(Customer customer, CustomerRequestDTO dto) throws CustomerException {
        customer.setFirstName(dto.getFirstName());
        customer.setLastName(dto.getLastName());

        if (dto.getGender() == null || dto.getGender().length() != 1) {
            throw new CustomerException("Gender must be 'M' or 'F'.");
        }
        customer.setGender(dto.getGender().charAt(0));

        try {
            Date dob = new SimpleDateFormat("yyyy-MM-dd", java.util.Locale.US).parse(dto.getDob());
            customer.setDob(dob);
        } catch (ParseException e) {
            throw new CustomerException("Invalid date format. Use yyyy-MM-dd.", e);
        }

        customer.setMobileNumber(dto.getMobileNumber());

        if (dto.getCityId() <= 0) {
            throw new CustomerException("City ID must be greater than 0.");
        }

        if (dto.getStateId() <= 0) {
            throw new CustomerException("State ID must be greater than 0.");
        }

        if (dto.getCountryId() <= 0) {
            throw new CustomerException("Country ID must be greater than 0.");
        }

        if (dto.getOccupationId() <= 0) {
            throw new CustomerException("Occupation ID must be greater than 0.");
        }

        customer.setCity(cityRepository.findById(dto.getCityId())
                .orElseThrow(() -> new CustomerException("Invalid city ID.")));

        customer.setStateId(dto.getStateId());
        customer.setCountryId(dto.getCountryId());
        customer.setOccupationId(dto.getOccupationId());
    }


    // ===== JPQL query ======

    public List<Customer> getCustomersByCityName(String cityName) throws CustomerException {
        List<Customer> customers = customerRepository.findByCityName(cityName);
        if (customers.isEmpty()) {
            throw new CustomerException("No customers found in city: " + cityName);
        }
        return customers;
    }

    public List<Customer> getCustomersByGender(char gender) throws CustomerException {
        List<Customer> customers = customerRepository.findByGender(gender);
        if (customers.isEmpty()) {
            throw new CustomerException("No customers found with gender: " + gender);
        }
        return customers;
    }

    public List<Customer> getCustomersBornBefore(Date date) throws CustomerException {
        List<Customer> customers = customerRepository.findBornBefore(date);
        if (customers.isEmpty()) {
            throw new CustomerException("No customers found born before " + date);
        }
        return customers;
    }

    public long getCustomerCountByCityName(String cityName) throws CustomerException {
        long count = customerRepository.countByCityName(cityName);
        if (count == 0) {
            throw new CustomerException("No customers found in city: " + cityName);
        }
        return count;
    }

    public List<Customer> getCustomersWithPremiumAbove(double amount) throws CustomerException {
        List<Customer> customers = customerRepository.findCustomersWithPremiumAbove(amount);
        if (customers.isEmpty()) {
            throw new CustomerException("No customers found with premium above " + amount);
        }
        return customers;
    }

    public List<Customer> getCustomersByPolicyType(String typeName) throws CustomerException {
        List<Customer> customers = customerRepository.findCustomersByPolicyType(typeName);
        if (customers.isEmpty()) {
            throw new CustomerException("No customers found with policy type: " + typeName);
        }
        return customers;
    }

    public List<Customer> getCustomersByOccupationId(int occupationId) throws CustomerException {
        List<Customer> customers = customerRepository.findByOccupationId(occupationId);
        if (customers.isEmpty()) {
            throw new CustomerException("No customers found for occupation ID: " + occupationId);
        }
        return customers;
    }

    public List<Customer> getCustomersBornAfter(Date date) throws CustomerException {
        List<Customer> customers = customerRepository.findCustomersBornAfter(date);
        if (customers.isEmpty()) {
            throw new CustomerException("No customers were born after the given date.");
        }
        return customers;
    }

    public List<Customer> getCustomersWithNoPolicies() throws CustomerException {
        List<Customer> customers = customerRepository.findCustomersWithNoPolicies();
        if (customers.isEmpty()) {
            throw new CustomerException("No customers found without any policies.");
        }
        return customers;
    }

    // === Validation ===

    private void validateCustomer(Customer customer) throws CustomerException {
        if (customer == null) throw new CustomerException("Customer cannot be null.");
        if (isBlank(customer.getFirstName())) throw new CustomerException("First name is required.");
        if (isBlank(customer.getLastName())) throw new CustomerException("Last name is required.");

        char gender = customer.getGender();
        if (gender != 'M' && gender != 'F') throw new CustomerException("Gender must be 'M' or 'F'.");

        Date dob = customer.getDob();
        if (dob == null) throw new CustomerException("Date of Birth is required.");

        LocalDate dobDate = dob.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
        if (dobDate.isAfter(LocalDate.now())) throw new CustomerException("DOB cannot be in the future.");

        if (!isValidMobileNumber(customer.getMobileNumber()))
            throw new CustomerException("Invalid mobile number.");

        if (customer.getCity() == null || customer.getCity().getCityId() <= 0)
            throw new CustomerException("Invalid City.");
        if (customer.getStateId() <= 0) throw new CustomerException("Invalid State ID.");
        if (customer.getCountryId() <= 0) throw new CustomerException("Invalid Country ID.");
        if (customer.getOccupationId() <= 0) throw new CustomerException("Invalid Occupation ID.");
    }

    private boolean isValidMobileNumber(String mobileNumber) {
        return mobileNumber != null && mobileNumber.matches("\\d{10}");
    }

    private static boolean isBlank(String str) {
        if (str == null) return true;
        for (int i = 0; i < str.length(); i++) {
            if (!Character.isWhitespace(str.charAt(i))) {
                return false;
            }
        }
        return true;
    }
}
