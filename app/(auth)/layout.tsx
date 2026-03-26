const AuthLayout = ({children}: {children: React.ReactNode}) => {
  return (
    <div className="container mx-auto flex justify-center items-center pt-24">{children}</div>
  )
}

export default AuthLayout