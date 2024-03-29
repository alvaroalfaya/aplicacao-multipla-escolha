﻿using Microsoft.EntityFrameworkCore;
using multipla_escolha_api.Models.DTO;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Security.Claims;
using System.Text.Json.Serialization;

namespace multipla_escolha_api.Models

{
    [Table("Usuarios")]
    public class Usuario
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string NomeDeUsuario { get; set; }
        [Required]
        [JsonIgnore]
        public string Senha { get; set; }
        [Required]
        public string Nome { get; set; }
        [Required]
        public string Sobrenome { get; set; }
        [Required]
        public string Email { get; set; }
        public string Telefone { get; set; }
        [Required]
        public Perfil Perfil { get; set; }

        [JsonIgnore]
        public ICollection<Turma> TurmasProfessor { get; set; }
        [JsonIgnore]
        public ICollection<TurmaAluno> TurmasAluno { get; set; }
        [JsonIgnore]
        public ICollection<Resultado> Resultados { get; set; }
        public Usuario()
        {

        }
        public Usuario(UsuarioDto dto)
        {
            Id = 0;
            if (dto.Id != null)
            {
                Id = (int)dto.Id;
            }
            NomeDeUsuario = dto.NomeDeUsuario;
            Senha = BCrypt.Net.BCrypt.HashPassword(dto.Senha);
            Nome = dto.Nome;
            Sobrenome = dto.Sobrenome;
            Email = dto.Email;
            Telefone = dto.Telefone;
            Perfil = dto.Perfil;
        }

        public static Dictionary<string, string> getUserClaims(ClaimsPrincipal claimsPrincipal)
        {
            Dictionary<string, string> userClaims = new();

            if (claimsPrincipal != null)
            {
                foreach (Claim claim in claimsPrincipal.Claims)
                {
                    userClaims[claim.Type] = claim.Value.ToString();
                }
            }
            return userClaims;
        }

        public static string checkIfUserNameOrEmailIsAlreadyUsed(UsuarioDto dto, Usuario sameUsernameOrEmailUser)
        {
            if (sameUsernameOrEmailUser != null)
            {
                if (sameUsernameOrEmailUser.NomeDeUsuario.Equals(dto.NomeDeUsuario))
                {
                    return "Nome de usuário já cadastrado!";
                }

                if (sameUsernameOrEmailUser.Email.Equals(dto.Email))
                {
                    return "Email já cadastrado!";
                }
            }
            return null;
        }
    }

    public enum Perfil
    {
        [Display(Name = "Aluno")]
        Aluno,
        [Display(Name = "Professor")]
        Professor
    }
}
