# Localidades do Brasil (cópia fixa do IBGE)

Cópia exata das respostas da [API de localidades do IBGE](https://servicodados.ibge.gov.br/api/docs/localidades),
guardada em arquivos: os mesmos campos e a mesma ordem que o IBGE devolve. Copiada em 15/10/2026.

Serve para quem precisa de estados e cidades (formulário de endereço, filtro) sem depender de o servidor do IBGE
estar no ar, ou com o certificado em ordem.

## Endereços

Troque `https://servicodados.ibge.gov.br/api/v1/localidades/` por
`https://cdn.jsdelivr.net/gh/danielbezerraoficial/localidades-br@1.0.0/` e acrescente `.json` no fim:

| No IBGE | Aqui |
|---|---|
| `/regioes` | `regioes.json` |
| `/estados` | `estados.json` |
| `/estados/24` ou `/estados/RN` | `estados/24.json` ou `estados/RN.json` |
| `/estados/24/municipios` ou `/estados/RN/municipios` | `estados/24/municipios.json` ou `estados/RN/municipios.json` |
| `/municipios` | `municipios.json` |

O `@1.0.0` no endereço é a edição: o conteúdo dela nunca muda. Se o IBGE criar um município, sai uma edição nova, e
quem usa troca o número quando quiser.

## Como atualizar

`node gerar.js` busca tudo de novo no IBGE e regrava os arquivos. O `sectigo-dv-r36.pem` existe porque, em out/2026,
o servidor do IBGE passou a mandar o certificado sem o intermediário da Sectigo. Quando o IBGE consertar, ele pode sair.

## Fonte

Dados públicos do IBGE (Instituto Brasileiro de Geografia e Estatística).
