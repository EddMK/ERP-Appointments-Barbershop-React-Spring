package com.example.backend.repository;

import com.example.backend.entity.Expense;

import java.sql.Timestamp;
import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

public interface ExpenseRepository extends CrudRepository<Expense, Integer> {

    @Query(value = " SELECT COALESCE(SUM(price), 0) AS turnover FROM expense WHERE month(date) = :month AND year(date) = :year  ;" ,nativeQuery = true)
    Integer findExpenseMonth(@Param("month") int month, @Param("year") int year );

    @Query(value = " SELECT COALESCE(SUM(price), 0)  FROM expense WHERE MONTH(date) = :month   AND YEAR(date) = :year AND  barbershop = :barbershopId AND type = 'Taxes';" ,nativeQuery = true)
    Integer getExpenseTaxesByBarbershop( @Param("month") int month, @Param("year") int year, @Param("barbershopId") int barbershopId );

    @Query(value = " SELECT COALESCE(SUM(price), 0)  FROM expense WHERE MONTH(date) = :month   AND YEAR(date) = :year AND  barbershop = :barbershopId AND type = 'Materiel';" ,nativeQuery = true)
    Integer getExpenseMaterielByBarbershop( @Param("month") int month, @Param("year") int year, @Param("barbershopId") int barbershopId );

    @Query(value = " SELECT COALESCE(SUM(price), 0)  FROM expense WHERE MONTH(date) = :month   AND YEAR(date) = :year AND  barbershop = :barbershopId AND type = 'Charges';" ,nativeQuery = true)
    Integer getExpenseChargesByBarbershop( @Param("month") int month, @Param("year") int year, @Param("barbershopId") int barbershopId );

    @Query(value = " SELECT type, COALESCE(SUM(price), 0)  FROM expense WHERE MONTH(date) = :month   AND YEAR(date) = :year AND  barbershop = :barbershopId GROUP BY type;" ,nativeQuery = true)
    List<List<String>> getExpenseByBarbershop( @Param("month") int month, @Param("year") int year, @Param("barbershopId") int barbershopId );

    @Query(value = "SELECT SUM(price) AS expense  FROM expense WHERE   MONTH(date) = MONTH( NOW() )   AND YEAR(date) = YEAR( NOW() ) ;" ,nativeQuery = true)
    Integer findExpenseThisMonth();

    @Query(value = "SELECT min(date) FROM EdBarbershop.expense; " ,nativeQuery = true)
    Timestamp getMinDate();

}
