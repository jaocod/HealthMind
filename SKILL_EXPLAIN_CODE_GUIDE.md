# 📚 Guia: Como Usar a Skill "Explain Code"

A skill `explain-code` foi atualizada com contexto completo do projeto HealthMind. Agora o Claude consegue explicar código de forma didática com **analogias, diagramas e exemplos práticos**.

## 🚀 Como Usar

Basta fazer perguntas sobre o código! Exemplos:

### 1. **Entender um componente**
```
"Explique como funciona o componente AuthProvider"
"O que faz o useSupabaseAuth hook?"
"Diagrama o fluxo de autenticação do login até salvar o usuário"
```

### 2. **Entender um arquivo**
```
"Como funciona app/services/database.ts?"
"Explique a estrutura de rotas com Expo Router"
"O que fazem os custom hooks em app/hooks?"
```

### 3. **Entender um padrão**
```
"Como o React Context passa dados entre componentes?"
"Por que usamos hooks em vez de componentes de classe?"
"Explique o fluxo de renderização de componentes React"
```

### 4. **Entender um flow**
```
"Diagrama o fluxo de dados ao fazer login no app"
"Como um mood entry é salvo no Supabase?"
"Trace a jornada de um usuário do onboarding até o dashboard"
```

## 📊 O que a Skill Faz

Quando você faz uma pergunta, a skill garante que a resposta terá:

1. **🎯 Analogia** - Uma comparação com algo do cotidiano
   ```
   "Um Context é como um balcão central numa loja..."
   ```

2. **📐 Diagrama** - Visualização com ASCII art
   ```
   ┌─────────────┐
   │ LoginScreen │
   └──────┬──────┘
          │ chama
          ▼
   ┌──────────────────┐
   │ useSupabaseAuth  │
   └──────┬───────────┘
          │ faz login
          ▼
   ┌──────────────────┐
   │ Supabase Server  │
   └──────────────────┘
   ```

3. **💻 Explicação passo-a-passo** - Código em sequência
   ```
   1. Usuário digita email e senha
   2. Clica em botão Login
   3. Chama useSupabaseAuth().signIn()
   4. ... (continua)
   ```

4. **⚠️ Gotcha** - Armadilhas comuns
   ```
   ⚠️ Erro comum: esquecer dependency array no useEffect
   Causa: re-render infinito
   Solução: [...] 
   ```

5. **✅ Exemplo** - Código real ou prático
   ```typescript
   // Código real do seu projeto
   const { user, signIn } = useSupabaseAuth();
   ```

## 🎓 Exemplos de Interação

### Exemplo 1: Explicar um Hook
```
Você: "Explique o useSupabaseAuth"

Claude (com skill):
🎯 Analogia: É como um recepcionista...

📊 Fluxo:
  App
   ├─ useContext(AuthContext)
   ├─ pega user, signIn, signOut
   └─ retorna para componente

💻 Como funciona:
  1. Hook lê do AuthContext...
  2. Retorna funções de auth...

⚠️ Cuidado: 
  Não rolar em loops infinitos...

✅ Uso correto:
  const { user } = useSupabaseAuth();
```

### Exemplo 2: Entender Fluxo de Login
```
Você: "Diagrama o fluxo desde o clique no botão Login até salvar a sessão"

Claude (com skill):
🎯 Analogia: Como um bilhete de entrada num cinema...

📊 Fluxo Completo:
  Usuario digita senha
  │
  └─→ Clica Login
      │
      └─→ signIn(email, password)
          │
          └─→ .signInWithPassword()
              │
              └─→ Supabase Auth
                  │
                  └─→ Gera JWT token
                      │
                      └─→ Armazena em SecureStore
                          │
                          └─→ Redux/Context atualiza
                              │
                              └─→ Navega para Home

💻 Código:
  // app/hooks/useSupabaseAuth.ts
  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth
      .signInWithPassword({ email, password })
    
    if (data.session) {
      await SecureStore.setItemAsync('session', JSON.stringify(data.session))
      return data
    }
  }

⚠️ Cuidados:
  - Não exposar token em logs
  - Sempre validar sessão expirada
  - Fazer logout ao sair
```

## 🔧 Customizações Futuras

Se você criar outras skills, você pode:

1. **Criar** `SKILL.md` na pasta `.agents/skills/skills/`
2. **Estruturar** com frontmatter YAML
3. **Seguir** o formato Agent Skills Open Standard

Exemplo de outra skill:
```yaml
---
name: react-best-practices
description: Analisa código React do projeto e sugere melhorias
metadata:
  tags: [react, performance, optimizations]
---

# React Best Practices - HealthMind

Quando analisar código React...
```

## 📚 Referências

- [Agent Skills Spec](https://agentskills.io/)
- [Supabase Skills](https://github.com/supabase/agent-skills)
- [Claude Documentation](https://claude.ai/resources)

---

**Dica:** A skill está sempre ativa! Para obtê-la, basta fazer perguntas naturais sobre o código do projeto. 🎯
