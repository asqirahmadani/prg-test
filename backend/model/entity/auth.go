package entity

type User struct {
	ID				int		`db:"id"`
	Role			string	`db:"role"`
	PasswordHash	string	`db:"password_hash"`
}