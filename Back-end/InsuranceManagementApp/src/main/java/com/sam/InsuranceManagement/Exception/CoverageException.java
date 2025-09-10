package com.sam.InsuranceManagement.Exception;

import java.io.Serial;

public class CoverageException extends Exception {
    @Serial
    private static final long serialVersionUID = 1L;

    public CoverageException(String message) {
        super(message);
    }

    public CoverageException(String message, Throwable cause) {
        super(message, cause);
    }
}
