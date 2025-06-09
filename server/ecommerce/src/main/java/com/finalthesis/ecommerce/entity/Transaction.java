package com.finalthesis.ecommerce.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.finalthesis.ecommerce.enums.TransactionStatus;
import com.finalthesis.ecommerce.enums.TransactionType;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;

    @Column(nullable = false, unique = true)
    String transactionCode;

    @Column(nullable = false)
    BigDecimal amount;

    @Column(nullable = false)
    BigDecimal platformFee;

    @Column(nullable = false)
    BigDecimal shopReceiveAmount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    TransactionType type; // PAYMENT, PAYOUT

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    TransactionStatus status; // PENDING, COMPLETED, FAILED

    String vnpayTransactionId;

    String description;

    @CreationTimestamp
    @Column(updatable = false)
    LocalDateTime createdAt;

    @UpdateTimestamp
    LocalDateTime updatedAt;

    LocalDateTime completedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", referencedColumnName = "id")
    Order order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shop_id", referencedColumnName = "id")
    Shop shop;
}
