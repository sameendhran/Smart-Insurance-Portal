package com.sam.InsuranceManagement.Exception;

import java.io.Serial;

public class CityException extends Exception {
    @Serial
    private static final long serialVersionUID = 1L;

    public CityException(String message) {
        super(message);
    }
}
