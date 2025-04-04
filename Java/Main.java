import java.util.HashMap;
import java.util.Scanner;

public class Main {
    private HashMap<String, Usuario> usuarios;
    private Scanner scanner;

    public Main() {
        usuarios = new HashMap<>();
        scanner = new Scanner(System.in);
    }

    public void exibirMenu() {
        int opcao;
        do {
            System.out.println("\nMENU");
            System.out.println("1 - Login");
            System.out.println("2 - Cadastrar Conta");
            System.out.println("3 - Esqueci minha senha");
            System.out.println("4 - Listar Usuários Cadastrados");
            System.out.println("0 - Sair");
            System.out.print("Escolha uma opção: ");
            opcao = scanner.nextInt();
            scanner.nextLine();

            switch (opcao) {
                case 1:
                    loginUsuario();
                    break;
                case 2:
                    cadastrarUsuario();
                    break;
                case 3:
                    esqueciMinhaSenha();
                    break;
                case 4:
                    listarUsuarios();
                    break;
                case 0:
                    System.out.println("Saindo...");
                    break;
                default:
                    System.out.println("Opção inválida. Tente novamente.");
            }
        } while (opcao != 0);
    }

    private void cadastrarUsuario() {
        System.out.print("Digite o nome de Usuário: ");
        String nome = scanner.nextLine();
        if (usuarios.containsKey(nome)) {
            System.out.println("Usuário já cadastrado!");
            return;
        }
        System.out.print("Digite seu Email: ");
        String email = scanner.nextLine();
        for (Usuario user : usuarios.values()) {
            if (user.getEmail().equals(email)) {
                System.out.println("Email já cadastrado!");
                return;
            }
        }
        System.out.print("Digite sua senha: ");
        String senha = scanner.nextLine();
        System.out.print("Digite novamente sua senha: ");
        String senhaB = scanner.nextLine();
        if (senha.equals(senhaB)) {
            Usuario novoUsuario = new Usuario();
            usuarios.put(nome, novoUsuario);
            System.out.println("Usuário cadastrado com sucesso!");
        } else {
            System.out.println("As senhas não são iguais, tente novamente");
            cadastrarUsuario();
        }
    }

    private void loginUsuario() {
        System.out.print("Digite seu email: ");
        String email = scanner.nextLine();
        System.out.print("Digite sua senha: ");
        String senha = scanner.nextLine();

        boolean loginSucesso = false;
        for (Usuario user : usuarios.values()) {
            if (user.getEmail().equals(email) && user.validarSenha(senha)) {
                System.out.println("Login bem-sucedido! Bem-vindo, " + user.getNome() + "!");
                loginSucesso = true;
                break;
            }
        }

        if (!loginSucesso) {
            System.out.println("Email ou senha incorretos!");
        }
    }

    private void esqueciMinhaSenha() {
        System.out.println("Funcionalidade ainda não implementada.");
    }

    private void listarUsuarios() {
        if (usuarios.isEmpty()) {
            System.out.println("Nenhum usuário cadastrado.");
        } else {
            System.out.println("\nUsuários Cadastrados:");
            for (Usuario user : usuarios.values()) {
                System.out.println(user);
            }
        }
    }

    public static void main(String[] args) {
        Main menu = new Main();
        menu.exibirMenu();
    }
}