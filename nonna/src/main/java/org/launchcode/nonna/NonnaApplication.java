package org.launchcode.nonna;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "org.launchcode.nonna")
public class NonnaApplication {

	public static void main(String[] args) {
		SpringApplication.run(NonnaApplication.class, args);
	}
}
