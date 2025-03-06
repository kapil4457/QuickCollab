package com.quickcollab;

import org.hibernate.collection.spi.PersistentBag;
import org.modelmapper.Conditions;
import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.util.ArrayList;
import java.util.List;

@SpringBootApplication
public class QuickcollabApplication {

	public static void main(String[] args) {
		SpringApplication.run(QuickcollabApplication.class, args);
	}

	@Bean
	public ModelMapper modelMapper() {
		ModelMapper modelMapper = new ModelMapper();
		modelMapper.getConfiguration()
				.setFieldMatchingEnabled(true)
				.setMatchingStrategy(MatchingStrategies.STRICT)
				.setPropertyCondition(Conditions.isNotNull());
		modelMapper.getConfiguration().setPropertyCondition(Conditions.isNotNull());
		modelMapper.addConverter(ctx -> new ArrayList<>(ctx.getSource()), PersistentBag.class, List.class);
		return modelMapper;
	}
}
