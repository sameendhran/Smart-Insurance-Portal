package com.sam.InsuranceManagement.Exception;

import java.io.Serial;

public class PolicyTypeException extends Exception {
    @Serial
    private static final long serialVersionUID = 1L;

    public PolicyTypeException(String message) {
        super(message);
    }

    public PolicyTypeException(String message, Throwable cause) {
        super(message, cause);
    }
}
