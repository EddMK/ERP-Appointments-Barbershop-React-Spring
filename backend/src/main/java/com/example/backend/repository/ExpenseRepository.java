package com.example.backend.repository;

import com.example.backend.entity.Expense;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

public interface ExpenseRepository extends CrudRepository<Expense, Integer> {

    @Query(value = " SELECT COALESCE(SUM(price), 0) AS turnover FROM expense WHERE month(date) = :month AND year(date) = :year  ;" ,nativeQuery = true)
    Integer findExpenseMonth(@Param("month") int month, @Param("year") int year );

    @Query(value = " SELECT type, SUM(price)  FROM expense WHERE barbershop = :barbershopId GROUP BY type;" ,nativeQuery = true)
    List<List<String>> getExpenseByBarbershop(@Param("barbershopId") int barbershopId );
    //List<Object> getExpenseByBarbershop(@Param("month") int month, @Param("year") int year, @Param("barbershopId") int barbershopId );

/*
 * 
SELECT expense.type, SUM(expense.price) 
FROM EdBarbershop.expense
WHERE barbershop = 246
GROUP BY expense.type;
 */

}
