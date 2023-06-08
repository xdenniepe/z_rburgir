package com.roboburger.core.utility;

import java.util.UUID;
import java.text.DecimalFormat;
import java.time.*;

import java.math.BigDecimal;
import java.math.RoundingMode;

public class Utility {
  public int age = 0;
  
	/*
	 * generateGUID
	 */
	public static String generateUUID() {
		UUID uuid = UUID.randomUUID();
		return uuid.toString();
	}

	/*
	 * convertLocalDateToLong()
	 */
	public static Long convertLocalDateToLong(LocalDateTime datetime) {
		return datetime.toEpochSecond(ZoneOffset.UTC);
	}

	public static Double formatDouble(Double decimalValue, int decimalPlaces ) {
		BigDecimal bd = new BigDecimal(decimalValue).setScale(decimalPlaces, RoundingMode.HALF_UP);
		double newValue = bd.doubleValue();

		return Double.valueOf(newValue);
	}
	
}
