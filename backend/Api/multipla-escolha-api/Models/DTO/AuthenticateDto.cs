﻿using System.ComponentModel.DataAnnotations;

namespace multipla_escolha_api.Models.DTO
{
    public class AuthenticateDto
    {
        [Required]
        public string NomeDeUsuario { get; set; }
        [Required]
        public string Senha { get; set; }
    }
}
