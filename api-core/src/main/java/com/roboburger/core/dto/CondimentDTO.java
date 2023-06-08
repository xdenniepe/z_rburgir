package com.roboburger.core.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@ToString
@Getter
@Setter
public class CondimentDTO {
    private Integer optionsTypeId;
    private String name;
}
