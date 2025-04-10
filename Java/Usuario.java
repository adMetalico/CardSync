public class Usuario {
    private String nome;
    private String senha;
    private String email;
    private Double numero;

    // Construtor com três parâmetros
    public Usuario(String nome, String email, String senha, Double numero) {
        this.nome = nome;
        this.email = email;
        this.senha = senha;
        this.numero = numero;
    }

    // Getters e Setters
    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Double getNumero() {
        return numero;
    }

    public void setNumero(Double numero) {
        this.numero = numero;
    }

    // Método para validar senha
    public boolean validarSenha(String senha) {
        return this.senha.equals(senha);
    }

    public String toString() {
        return "\nNome: " + nome + " \nsenha: " + senha + " \nemail: " + email + " \nnumero: " + numero +"\n";
    }
}