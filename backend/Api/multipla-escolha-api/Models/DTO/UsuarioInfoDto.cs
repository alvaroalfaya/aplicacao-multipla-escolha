﻿using System.ComponentModel.DataAnnotations;
using System.Security.Claims;

namespace multipla_escolha_api.Models.DTO
{
    public class UsuarioInfoDto
    {
        public string Id { get; set; }
        public string NomeCompleto { get; set; }
        public string Perfil { get; set; }
        public int? NumeroDeNotificacoesNaoLidas { get; set; }
        public UsuarioInfoDto()
        {

        }
        public UsuarioInfoDto(Dictionary<string, string> userClaims, int? numeroDeNotificacoesNaoLidas)
        {
            Id = userClaims[ClaimTypes.NameIdentifier];
            NomeCompleto = userClaims[ClaimTypes.GivenName];
            Perfil = userClaims[ClaimTypes.Role];
            NumeroDeNotificacoesNaoLidas = 0;
            if (numeroDeNotificacoesNaoLidas != null)
            {
                NumeroDeNotificacoesNaoLidas = numeroDeNotificacoesNaoLidas;
            }
        }
    }
}
