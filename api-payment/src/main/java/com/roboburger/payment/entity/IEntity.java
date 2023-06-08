package com.roboburger.payment.entity;

public interface IEntity {
  
	public void setWhoAdded(Integer whoAdded);

	public Integer getWhoAdded();

	public void setWhenAdded(Integer whenAdded);

	public Integer getWhenAdded();

	public void setWhoUpdated(Integer whoUpdated);

	public Integer getWhoUpdated();

	public void setTimestamp(Integer timestamp);

	public Integer getTimestamp();
}
