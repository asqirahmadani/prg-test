package utils

import (
	"database/sql"
	"fmt"
)

func CheckRowsAffected(result sql.Result, err error, msg string) error {
	if err != nil {
		return ErrInternalServer(fmt.Sprintf("error database: %v", err))
	}
	n, e := result.RowsAffected()
	if e != nil {
		return e
	}
	if n == 0 {
		return ErrUnprocessableEntity(msg)
	}
	return nil
}