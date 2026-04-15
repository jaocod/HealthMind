---
name: explain-code
description: Explica código TypeScript/React do HealthMind com analogias, diagramas e contexto do projeto Supabase + Expo
metadata:
  tags: [typescript, react-native, supabase, explain, teaching]
---

# Explain Code - HealthMind

Explica código do projeto HealthMind de forma didática e visual.

## 📚 Contexto do Projeto

**Tech Stack:** Expo (React Native) + Supabase + TypeScript
- 🔐 Autenticação: Supabase Auth  
- 🗄️ Banco de dados: Supabase PostgreSQL
- 🛣️ Routing: Expo Router com grupos dinâmicos ((public), (auth), (tabs))
- 🎛️ State management: React Context + Custom hooks

## 🎯 Estratégia de Explicação

Quando explicar código, **sempre siga esta ordem**:

### 1️⃣ **ANALOGIA** - Comparação com vida real
   - Tome o conceito abstrato e compare a algo do cotidiano
   - Exemplo: "Um Context Provider é como um balcão de atendimento que compartilha informações para toda a loja"

### 2️⃣ **DIAGRAMA** - Visual com ASCII art
   - Mostre fluxo de dados com setas
   - Estrutura de componentes e hierarquia
   - Relações entre arquivos e chamadas
   - Use boxes (┌─ ─┐), setas (──→), indentação

### 3️⃣ **PASSO-A-PASSO** - Explicação do código
   - Descreva cada parte importante em português simples
   - Cite os arquivos e linhas relevantes
   - Detalhe fluxo de execução
   - Mostre valores em cada etapa

### 4️⃣ **⚠️ GOTCHA** - Armadilhas comuns
   - Erros frequentes com esse padrão
   - Misconceptions que iniciantes têm
   - Por que dá erro
   - Dica: Como evitar

### 5️⃣ **✅ EXEMPLO** - Demonstração prática
   - Código real do projeto se possível
   - Como usar corretamente
   - Comportamento esperado
   - Sugestão de melhorias

## 📋 Padrões Específicos - HealthMind

- **Autenticação**: Hook `useSupabaseAuth` em `app/hooks/useSupabaseAuth.ts`
- **Database**: Operações em `app/services/database.ts` com cliente Supabase
- **Rotas**: Grupos em `(public)` (login), `(auth)` (protegidas), `(tabs)` (abas)
- **Context**: `AuthProvider` em `app/providers/AuthProvider.tsx`
- **Estado**: Hooks para gerenciar dados do usuário, mood entries, profissionais
- **Segurança**: Validar JWT tokens, não armazenar dados sensíveis locally