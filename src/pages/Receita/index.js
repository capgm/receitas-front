import { useEffect, useState } from "react";
import "./receita.css";
import axios from "axios";

export default function Receita() {
  const [idReceita, setIdReceita] = useState();
  const [categoria, setCategoria] = useState();
  const [ingredientes, setIngredientes] = useState();
  const [modoPreparo, setModoPreparo] = useState();
  const [receitas, setReceitas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [index, setIndex] = useState();
  const [inEdicao, setInEdicao] = useState(false);

  useEffect(() => {
    async function carergarReceitas() {
      await axios
        .get("https://receitas-back.netlify.app/receitas")
        .then((receitas) => {
          if (receitas.data.length > 0) {
            setReceitas(receitas.data);
          } else {
            setReceitas([]);
          }
        })
        .catch((erro) => {
          console.log(erro);
        });
    }

    carergarReceitas();
  }, []);

  useEffect(() => {
    async function carergarCategorias() {
      await axios
        .get("https://receitas-back.netlify.app/categorias")
        .then((categorias) => {
          if (categorias.data.length > 0) {
            setCategorias(categorias.data);
          } else {
            setCategorias([]);
          }
        })
        .catch((erro) => {
          console.log(erro);
        });
    }

    carergarCategorias();
  }, []);

  async function incluir() {
    const objInclusao = {
      categoria: categoria,
      ingredientes: ingredientes,
      modoPreparo: modoPreparo,
      id: idReceita,
    };

    console.log(categoria);

    await axios
      .post("https://receitas-back.netlify.app/receitas", objInclusao)
      .then(() => {
        receitas.push(objInclusao);
        setCategoria("");
        setIngredientes("");
        setModoPreparo("");
        setReceitas(receitas);
      })
      .catch((erro) => {
        console.log(erro);
      });
  }

  function edit(receita, index, e) {
    e.preventDefault();
    setCategoria(receita.categoria);
    setIngredientes(receita.ingredientes);
    setModoPreparo(receita.modoPreparo);
    setIdReceita(receita._id);
    setIndex(index);
    setInEdicao(true);
  }

  async function confirmarEdicao() {
    const objAlteracao = {
      categoria: categoria,
      ingredientes: ingredientes,
      modoPreparo: modoPreparo,
      _id: idReceita,
    };

    console.log(objAlteracao);
    console.log(idReceita);

    await axios
      .put("https://receitas-back.netlify.app/receitas/" + idReceita, objAlteracao)
      .then(() => {
        const lista = receitas;

        lista[index] = objAlteracao;
        setReceitas(lista);

        setCategoria("");
        setIngredientes("");
        setModoPreparo("");
        setInEdicao(false);
      })
      .catch((erro) => {
        console.log(erro);
      });
  }

  async function deletar(receita, e) {
    e.preventDefault();

    await axios
      .delete("https://receitas-back.netlify.app/receitas/" + receita._id)
      .then(() => {
        const lista = receitas.filter((objeto) => {
          return (
            objeto.categoria !== receita.categoria &&
            objeto.ingredientes !== receita.ingredientes &&
            objeto.modoPreparo !== receita.modoPreparo
          );
        });
        setReceitas(lista);
      })
      .catch((erro) => {
        console.log(erro);
      });
  }

  function botaoVoltar(){
    setCategoria("");
    setIngredientes("");
    setModoPreparo("");
    setIdReceita("");
    setInEdicao(false);
  }

  return (
    <div>
      <header>
        <h1>Cadastro de Receitas Culinárias</h1>
      </header>

      <main>
        <form id="recipeForm">
          <label for="categoria">Categoria:</label>
          <select
            value={categoria}
            onChange={(e) => {
              setCategoria(e.target.value);
            }}
          >
            <option value={-1}>Selecione uma categoria</option>
            {categorias.map((categoria, index) => {
              return (
                <option key={index} value={categoria.categoria}>
                  {categoria.categoria}
                </option>
              );
            })}
          </select>

          <label for="ingredientes">Ingredientes:</label>
          <textarea
            id="ingredientes"
            name="ingredientes"
            rows="4"
            value={ingredientes}
            onChange={(e) => setIngredientes(e.target.value)}
            required
          ></textarea>

          <label for="modoPreparo">Modo de Preparo:</label>
          <textarea
            id="modoPreparo"
            name="modoPreparo"
            value={modoPreparo}
            onChange={(e) => setModoPreparo(e.target.value)}
            rows="6"
            required
          ></textarea>
        </form>
        {inEdicao ? (
          <div className="div-button">
            <button
              className="button-incluir"
              onClick={() => confirmarEdicao()}
            >
              Alterar Receita
            </button>
            <button
              className="button-voltar"
              onClick={() => botaoVoltar()}
            >
              Voltar
            </button>
          </div>
        ) : (
          <button className="button-incluir" onClick={() => incluir()}>
            Cadastrar Receita
          </button>
        )}
      </main>

      {receitas.map((receita, index) => {
        return (
          <main key={index}>
            <div>
              <form id="recipeForm">
                <label for="categoria">Categoria:</label>
                <input
                  type="text"
                  id="categoria"
                  value={receita.categoria}
                  name="categoria"
                  disabled
                />

                <label for="ingredientes">Ingredientes:</label>
                <textarea
                  id="ingredientes"
                  name="ingredientes"
                  rows="4"
                  value={receita.ingredientes}
                  disabled
                ></textarea>

                <label for="modoPreparo">Modo de Preparo:</label>
                <textarea
                  id="modoPreparo"
                  name="modoPreparo"
                  value={receita.modoPreparo}
                  rows="6"
                  disabled
                ></textarea>
                <div className="div-button">
                  <button
                    className="button-alteracao"
                    onClick={(e) => edit(receita, index, e)}
                  >
                    Editar Receita
                  </button>
                  <button
                    className="button-excluir"
                    onClick={(e) => deletar(receita, e)}
                  >
                    Excluir Receita
                  </button>
                </div>
              </form>
            </div>
          </main>
        );
      })}
    </div>
  );
}
