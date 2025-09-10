package com.sam.InsuranceManagement.Response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.sam.InsuranceManagement.DTO.customer.CustomerResponseDTO;
import com.sam.InsuranceManagement.DTO.city.CityResponseDTO;
import com.sam.InsuranceManagement.DTO.policy.PolicyResponseDTO;
import com.sam.InsuranceManagement.DTO.coverage.CoverageResponseDTO;
import com.sam.InsuranceManagement.DTO.policyType.PolicyTypeResponseDTO;
import com.sam.InsuranceManagement.Projection.PolicyBasicInfo;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ResponseObject {

    private String successMessage;
    private String failureMessage;
    private boolean success; // <-- ADDED THIS FIELD

    private CustomerResponseDTO customerDTO;
    private List<CustomerResponseDTO> customerListDTO;

    private CityResponseDTO cityDTO;
    private List<CityResponseDTO> cityListDTO;

    private PolicyResponseDTO policyDTO;
    private List<PolicyResponseDTO> policyListDTO;

    private CoverageResponseDTO coverageDTO;
    private List<CoverageResponseDTO> coverageListDTO;

    private PolicyTypeResponseDTO policyTypeDTO;
    private List<PolicyTypeResponseDTO> policyTypeListDTO;

    private List<PolicyBasicInfo> policyBasicList;

    private Double premiumTotal;

    private Object data;

    private Long customerCount;

    public ResponseObject() {
        // Default constructor
    }

    /**
     * Constructor for responses that only contain a message (success or failure).
     * @param message The message to be set.
     * @param isSuccess True if it's a success message, false for a failure message.
     */
    public ResponseObject(String message, boolean isSuccess) {
        this.success = isSuccess; // <-- NOW SETTING THE 'success' BOOLEAN FIELD
        if (isSuccess) {
            this.successMessage = message;
            this.failureMessage = null; // Ensure failure message is null on success
        } else {
            this.failureMessage = message;
            this.successMessage = null; // Ensure success message is null on failure
        }
    }

    /**
     * Constructor for responses that contain data and a message (success or failure).
     * The data will be set to the 'data' field of type Object.
     * @param data The data payload (e.g., List<AdminUserDTO>).
     * @param message The message to be set.
     * @param isSuccess True if it's a success message, false for a failure message.
     */
    public ResponseObject(Object data, String message, boolean isSuccess) {
        this(message, isSuccess); // Call the other constructor to set the message and success status
        this.data = data;
    }

    // @Getter and @Setter (from Lombok) will generate isSuccess() and setSuccess() methods.
    // If you're not using Lombok, you would manually add:
    // public boolean isSuccess() { return success; }
    // public void setSuccess(boolean success) { this.success = success; }
}