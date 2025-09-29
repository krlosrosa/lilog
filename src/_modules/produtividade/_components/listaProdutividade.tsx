'use client'
import { CardProdutividade } from "./cardProdutividade";
import { BuscarProdutividadeQuery } from "@/_services/graphql/produtividade/getProdutividade.graphql";

type ProdutividadeArray = BuscarProdutividadeQuery['produtividade']

export function ListaProdutividade({ produtividade }: { produtividade?: ProdutividadeArray }) {

  return (
    <div className="w-full">
      {
        produtividade && produtividade?.map((produtividade) => (
          <CardProdutividade key={produtividade.idDemanda} produtividade={produtividade} />
        ))
      }
    </div>
  )
}