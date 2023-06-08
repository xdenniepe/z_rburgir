package com.roboburger.payment.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "[payment]")
public class Payment extends AbstractEntity implements IEntity {
 
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "payment_id")
    private Integer paymentId;

    @Column(name="pi_payment_type")
    private String piPaymenType;

    @Column(name="pi_transaction_origin")
    private String piTransactionOrigin;

    @Column(name="pi_card_type")
    private String piCardType;

    @Column(name="pi_cardholder_name")
    private String piCardholderName;

    @Column(name="pi_credit_card_number")
    private String piCreditCardNumber;

    @Column(name="pi_expiration_date")
    private String piExpirationDate;

    @Column(name="pi_account_type")
    private String piAccountType;

    @Column(name="pi_country_issuance")
    private String piCountryIssuance;

    @Column(name="ti_merchant")
    private String tiMerchant;

    @Column(name="ti_merchant_account")
    private String tiMerchantAccount;

    @Column(name="ti_transaction_type")
    private String tiTransactionType;

    @Column(name="ti_amount")
    private String tiAmount;

    @Column(name="ti_transaction_date")
    private Integer tiTransactionDate;

    @Column(name="ti_status")
    private String tiStatus;

    @Column(name="ti_settlement_batch")
    private String tiSettlementBatch;

    @Column(name="ti_processor_authorization_code")
    private String tiProcessorAuthorizationCode;
 
    @JsonIgnore
    @OneToOne
	@JoinColumn(name = "transaction_id")
    private Transaction transaction;

}
