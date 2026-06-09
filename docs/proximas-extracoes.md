# Próximas Extrações Técnicas

Este projeto agora separa interface e regra de negócio em camadas.

## Camada de interface

- `src/app/`: rotas Next.
- `src/components/`: componentes React de apresentação e interação.
- `public/simulador-aar.html`: simulador AAR legado ainda embarcado na rota AAR.

## Camada de domínio

- `src/domain/aarEngine.ts`: motor AAR TypeScript inicial, com fila, pausa, transferência e bingo fuel.
- `src/domain/uavSolver.ts`: solver UAV aproximado, separado do componente React e preparado para ser substituído por PyThrust.
- `src/domain/ontology.ts`: vocabulário comum de missão, energia, restrições, catálogo e solver.
- `src/domain/combinedMission.ts`: resumo combinado para comparar AAR e UAV sob a mesma ontologia.
- `src/data/sampleMission.ts`: cenário amostral que executa AAR + UAV e alimenta o painel combinado.
- `src/components/CombinedMissionPanel.tsx`: leitura visual da missão combinada sem carregar os simuladores completos.
- `tests/domain/smoke.test.mjs`: teste mínimo de domínio sem dependências externas.

## Próximos passos recomendados

1. Migrar gradualmente o simulador AAR legado para consumir `simulateAar`.
2. Trocar o smoke test por testes TypeScript formais quando as dependências locais estiverem instaladas.
3. Conectar a visualização 3D aos eventos emitidos pelo motor AAR.
4. Criar uma rota/API para executar PyThrust Python/OpenMDAO fora do browser.
5. Evoluir a missão combinada para aceitar cenários salvos e gerar relatórios.
