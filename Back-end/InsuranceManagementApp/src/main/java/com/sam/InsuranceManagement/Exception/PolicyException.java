package com.sam.InsuranceManagement.Exception;

import java.io.Serial;

public class PolicyException extends Exception {
    @Serial
    private static final long serialVersionUID = 1L;

    public PolicyException(String message) {
        super(message);
    }

    public PolicyException(String message, Throwable cause) {
        super(message, cause);
    }
}
