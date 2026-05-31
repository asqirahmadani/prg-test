package entity

type User struct {
	ID				int		`db:"id"`
	Role			string	`db:"role"`
	PasswordHash	string	`db:"password_hash"`
}

type UserProfile struct {
	Name		string	`db:"name"`
	Username	string	`db:"username"`
}