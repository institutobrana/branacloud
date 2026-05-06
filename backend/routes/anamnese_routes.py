from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy import func
from sqlalchemy.orm import Session

from database import get_db
from models.anamnese import AnamnesePergunta, AnamneseQuestionario
from models.anamnese_resposta import AnamneseResposta
from models.paciente import Paciente
from models.usuario import Usuario
from security.dependencies import get_current_user, require_module_access

router = APIRouter(
    prefix="/anamnese",
    tags=["anamnese"],
    dependencies=[Depends(require_module_access("anamnese"))],
)


class QuestionarioPayload(BaseModel):
    nome: str
    ativo: bool = True
    ordem: int | None = None
    copiar_do_questionario_id: int | None = None


class PerguntaPayload(BaseModel):
    numero: int | None = None
    tipo_pergunta: int | None = None
    tipo_resposta: int | None = None
    texto: str
    mensagem_alerta: str | None = None
    ativo: bool = True


class RespostaPayload(BaseModel):
    pergunta_id: int
    resposta: str | None = None


def _questionario_or_404(db: Session, clinica_id: int, questionario_id: int) -> AnamneseQuestionario:
    item = (
        db.query(AnamneseQuestionario)
        .filter(
            AnamneseQuestionario.id == questionario_id,
            AnamneseQuestionario.clinica_id == clinica_id,
        )
        .first()
    )
    if not item:
        raise HTTPException(status_code=404, detail="Questionario nao encontrado.")
    return item


def _pergunta_or_404(db: Session, clinica_id: int, pergunta_id: int) -> AnamnesePergunta:
    item = (
        db.query(AnamnesePergunta)
        .filter(
            AnamnesePergunta.id == pergunta_id,
            AnamnesePergunta.clinica_id == clinica_id,
        )
        .first()
    )
    if not item:
        raise HTTPException(status_code=404, detail="Pergunta nao encontrada.")
    return item


def _paciente_or_404(db: Session, clinica_id: int, paciente_id: int) -> Paciente:
    item = (
        db.query(Paciente)
        .filter(
            Paciente.id == paciente_id,
            Paciente.clinica_id == clinica_id,
        )
        .first()
    )
    if not item:
        raise HTTPException(status_code=404, detail="Paciente nao encontrado.")
    return item


def _validar_tipo_pergunta(valor: int | None) -> int:
    tipo = int(valor or 1)
    if tipo not in (1, 2, 3):
        raise HTTPException(status_code=400, detail="Tipo da pergunta invalido. Use 1, 2 ou 3.")
    return tipo


def _validar_tipo_resposta(valor: int | None) -> int:
    tipo = int(valor or 1)
    if tipo not in (1, 2, 3):
        raise HTTPException(status_code=400, detail="Tipo da resposta invalido. Use 1, 2 ou 3.")
    return tipo


@router.get("/questionarios")
def listar_questionarios(
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    itens = (
        db.query(AnamneseQuestionario)
        .filter(AnamneseQuestionario.clinica_id == current_user.clinica_id)
        .order_by(AnamneseQuestionario.ordem.asc(), AnamneseQuestionario.nome.asc())
        .all()
    )
    return [
        {
            "id": int(item.id),
            "nome": str(item.nome or "").strip(),
            "ativo": bool(item.ativo),
            "ordem": int(item.ordem or 0),
        }
        for item in itens
    ]


@router.post("/questionarios")
def criar_questionario(
    payload: QuestionarioPayload,
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    nome = str(payload.nome or "").strip()
    if not nome:
        raise HTTPException(status_code=400, detail="Informe o nome do questionario.")
    existe = (
        db.query(AnamneseQuestionario.id)
        .filter(
            AnamneseQuestionario.clinica_id == current_user.clinica_id,
            AnamneseQuestionario.nome == nome,
        )
        .first()
    )
    if existe:
        raise HTTPException(status_code=400, detail="Ja existe questionario com este nome.")
    ordem = int(payload.ordem or 0) or None
    if ordem is None:
        ordem = (
            db.query(func.max(AnamneseQuestionario.ordem))
            .filter(AnamneseQuestionario.clinica_id == current_user.clinica_id)
            .scalar()
        )
        ordem = int(ordem or 0) + 1
    item = AnamneseQuestionario(
        clinica_id=current_user.clinica_id,
        nome=nome,
        ativo=bool(payload.ativo),
        ordem=max(1, int(ordem)),
    )
    db.add(item)

    copiar_id = int(payload.copiar_do_questionario_id or 0)
    if copiar_id > 0:
        origem = _questionario_or_404(db, current_user.clinica_id, copiar_id)
        perguntas_origem = (
            db.query(AnamnesePergunta)
            .filter(
                AnamnesePergunta.clinica_id == current_user.clinica_id,
                AnamnesePergunta.questionario_id == origem.id,
            )
            .order_by(AnamnesePergunta.numero.asc(), AnamnesePergunta.id.asc())
            .all()
        )
        db.flush()  # Garante item.id para amarrar as perguntas copiadas
        usados: set[int] = set()
        proximo = 1
        for origem_pergunta in perguntas_origem:
            numero_origem = int(origem_pergunta.numero or 0)
            if numero_origem > 0 and numero_origem not in usados:
                numero_novo = numero_origem
            else:
                while proximo in usados:
                    proximo += 1
                numero_novo = proximo
            usados.add(numero_novo)
            if numero_novo >= proximo:
                proximo = numero_novo + 1
            db.add(
                AnamnesePergunta(
                    clinica_id=current_user.clinica_id,
                    questionario_id=int(item.id),
                    numero=int(numero_novo),
                    tipo_pergunta=_validar_tipo_pergunta(getattr(origem_pergunta, "tipo_pergunta", 1)),
                    tipo_resposta=_validar_tipo_resposta(getattr(origem_pergunta, "tipo_resposta", 1)),
                    texto=str(origem_pergunta.texto or "").strip(),
                    mensagem_alerta=str(getattr(origem_pergunta, "mensagem_alerta", "") or "").strip() or None,
                    ativo=bool(origem_pergunta.ativo),
                )
            )

    db.commit()
    db.refresh(item)
    return {"id": int(item.id), "nome": item.nome, "ativo": bool(item.ativo), "ordem": int(item.ordem or 0)}


@router.put("/questionarios/{questionario_id}")
def atualizar_questionario(
    questionario_id: int,
    payload: QuestionarioPayload,
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    item = _questionario_or_404(db, current_user.clinica_id, questionario_id)
    nome = str(payload.nome or "").strip()
    if not nome:
        raise HTTPException(status_code=400, detail="Informe o nome do questionario.")
    existe = (
        db.query(AnamneseQuestionario.id)
        .filter(
            AnamneseQuestionario.clinica_id == current_user.clinica_id,
            AnamneseQuestionario.nome == nome,
            AnamneseQuestionario.id != item.id,
        )
        .first()
    )
    if existe:
        raise HTTPException(status_code=400, detail="Ja existe questionario com este nome.")
    item.nome = nome
    item.ativo = bool(payload.ativo)
    if payload.ordem is not None:
        item.ordem = max(1, int(payload.ordem))
    db.commit()
    return {"detail": "Questionario atualizado."}


@router.delete("/questionarios/{questionario_id}")
def excluir_questionario(
    questionario_id: int,
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    item = _questionario_or_404(db, current_user.clinica_id, questionario_id)
    perguntas = (
        db.query(AnamnesePergunta.id)
        .filter(
            AnamnesePergunta.clinica_id == current_user.clinica_id,
            AnamnesePergunta.questionario_id == item.id,
        )
        .first()
    )
    if perguntas:
        raise HTTPException(status_code=409, detail="Remova as perguntas antes de excluir o questionario.")
    db.delete(item)
    db.commit()
    return {"detail": "Questionario excluido."}


@router.get("/questionarios/{questionario_id}/perguntas")
def listar_perguntas(
    questionario_id: int,
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    _questionario_or_404(db, current_user.clinica_id, questionario_id)
    itens = (
        db.query(AnamnesePergunta)
        .filter(
            AnamnesePergunta.clinica_id == current_user.clinica_id,
            AnamnesePergunta.questionario_id == questionario_id,
        )
        .order_by(AnamnesePergunta.numero.asc(), AnamnesePergunta.id.asc())
        .all()
    )
    return [
        {
            "id": int(item.id),
            "numero": int(item.numero or 0),
            "tipo_pergunta": int(getattr(item, "tipo_pergunta", 1) or 1),
            "tipo_resposta": int(getattr(item, "tipo_resposta", 1) or 1),
            "texto": str(item.texto or "").strip(),
            "mensagem_alerta": str(getattr(item, "mensagem_alerta", "") or "").strip(),
            "ativo": bool(item.ativo),
        }
        for item in itens
    ]


@router.post("/questionarios/{questionario_id}/perguntas")
def criar_pergunta(
    questionario_id: int,
    payload: PerguntaPayload,
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    _questionario_or_404(db, current_user.clinica_id, questionario_id)
    texto = str(payload.texto or "").strip()
    if not texto:
        raise HTTPException(status_code=400, detail="Informe o texto da pergunta.")
    tipo_pergunta = _validar_tipo_pergunta(payload.tipo_pergunta if payload.tipo_pergunta is not None else 1)
    tipo_resposta = _validar_tipo_resposta(payload.tipo_resposta if payload.tipo_resposta is not None else 1)
    mensagem_alerta = str(payload.mensagem_alerta or "").strip() or None
    numero = int(payload.numero or 0)
    if numero <= 0:
        numero = (
            db.query(func.max(AnamnesePergunta.numero))
            .filter(
                AnamnesePergunta.clinica_id == current_user.clinica_id,
                AnamnesePergunta.questionario_id == questionario_id,
            )
            .scalar()
        )
        numero = int(numero or 0) + 1
    existe = (
        db.query(AnamnesePergunta.id)
        .filter(
            AnamnesePergunta.clinica_id == current_user.clinica_id,
            AnamnesePergunta.questionario_id == questionario_id,
            AnamnesePergunta.numero == numero,
        )
        .first()
    )
    if existe:
        raise HTTPException(status_code=400, detail="Ja existe pergunta com este numero.")
    item = AnamnesePergunta(
        clinica_id=current_user.clinica_id,
        questionario_id=questionario_id,
        numero=numero,
        tipo_pergunta=tipo_pergunta,
        tipo_resposta=tipo_resposta,
        texto=texto,
        mensagem_alerta=mensagem_alerta,
        ativo=bool(payload.ativo),
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return {
        "id": int(item.id),
        "numero": int(item.numero or 0),
        "tipo_pergunta": int(getattr(item, "tipo_pergunta", 1) or 1),
        "tipo_resposta": int(getattr(item, "tipo_resposta", 1) or 1),
        "texto": item.texto,
        "mensagem_alerta": str(getattr(item, "mensagem_alerta", "") or "").strip(),
        "ativo": bool(item.ativo),
    }


@router.put("/perguntas/{pergunta_id}")
def atualizar_pergunta(
    pergunta_id: int,
    payload: PerguntaPayload,
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    item = _pergunta_or_404(db, current_user.clinica_id, pergunta_id)
    texto = str(payload.texto or "").strip()
    if not texto:
        raise HTTPException(status_code=400, detail="Informe o texto da pergunta.")
    tipo_pergunta = _validar_tipo_pergunta(
        payload.tipo_pergunta if payload.tipo_pergunta is not None else int(getattr(item, "tipo_pergunta", 1) or 1)
    )
    tipo_resposta = _validar_tipo_resposta(
        payload.tipo_resposta if payload.tipo_resposta is not None else int(getattr(item, "tipo_resposta", 1) or 1)
    )
    mensagem_alerta = item.mensagem_alerta
    if payload.mensagem_alerta is not None:
        mensagem_alerta = str(payload.mensagem_alerta or "").strip() or None
    numero = int(payload.numero or item.numero or 0)
    if numero <= 0:
        raise HTTPException(status_code=400, detail="Numero invalido.")
    existe = (
        db.query(AnamnesePergunta.id)
        .filter(
            AnamnesePergunta.clinica_id == current_user.clinica_id,
            AnamnesePergunta.questionario_id == item.questionario_id,
            AnamnesePergunta.numero == numero,
            AnamnesePergunta.id != item.id,
        )
        .first()
    )
    if existe:
        raise HTTPException(status_code=400, detail="Ja existe pergunta com este numero.")
    item.numero = numero
    item.tipo_pergunta = tipo_pergunta
    item.tipo_resposta = tipo_resposta
    item.texto = texto
    item.mensagem_alerta = mensagem_alerta
    item.ativo = bool(payload.ativo)
    db.commit()
    return {"detail": "Pergunta atualizada."}


@router.delete("/perguntas/{pergunta_id}")
def excluir_pergunta(
    pergunta_id: int,
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    item = _pergunta_or_404(db, current_user.clinica_id, pergunta_id)
    db.delete(item)
    db.commit()
    return {"detail": "Pergunta excluida."}


@router.post("/questionarios/{questionario_id}/renumerar")
def renumerar_perguntas(
    questionario_id: int,
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    _questionario_or_404(db, current_user.clinica_id, questionario_id)
    itens = (
        db.query(AnamnesePergunta)
        .filter(
            AnamnesePergunta.clinica_id == current_user.clinica_id,
            AnamnesePergunta.questionario_id == questionario_id,
        )
        .order_by(AnamnesePergunta.numero.asc(), AnamnesePergunta.id.asc())
        .all()
    )
    numero = 1
    for item in itens:
        item.numero = numero
        numero += 1
    db.commit()
    return {"detail": "Perguntas renumeradas.", "total": len(itens)}


@router.get("/pacientes/{paciente_id}/respostas")
def listar_respostas_paciente(
    paciente_id: int,
    questionario_id: int | None = Query(default=None),
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    _paciente_or_404(db, current_user.clinica_id, paciente_id)
    qid = int(questionario_id or 0)
    if qid <= 0:
        qid = (
            db.query(AnamneseQuestionario.id)
            .filter(AnamneseQuestionario.clinica_id == current_user.clinica_id)
            .order_by(AnamneseQuestionario.ordem.asc(), AnamneseQuestionario.id.asc())
            .scalar()
        )
    if not qid:
        return {"questionario_id": None, "questionario_nome": "", "itens": []}

    questionario = _questionario_or_404(db, current_user.clinica_id, int(qid))
    perguntas = (
        db.query(AnamnesePergunta)
        .filter(
            AnamnesePergunta.clinica_id == current_user.clinica_id,
            AnamnesePergunta.questionario_id == questionario.id,
        )
        .order_by(AnamnesePergunta.numero.asc(), AnamnesePergunta.id.asc())
        .all()
    )
    respostas = (
        db.query(AnamneseResposta)
        .filter(
            AnamneseResposta.clinica_id == current_user.clinica_id,
            AnamneseResposta.paciente_id == int(paciente_id),
            AnamneseResposta.pergunta_id.in_([int(p.id) for p in perguntas] or [0]),
        )
        .all()
    )
    respostas_map = {int(r.pergunta_id): str(r.resposta or "") for r in respostas}
    itens = [
        {
            "pergunta_id": int(p.id),
            "numero": int(p.numero or 0),
            "tipo_pergunta": int(getattr(p, "tipo_pergunta", 1) or 1),
            "tipo_resposta": int(getattr(p, "tipo_resposta", 1) or 1),
            "texto": str(p.texto or "").strip(),
            "mensagem_alerta": str(getattr(p, "mensagem_alerta", "") or "").strip(),
            "resposta": respostas_map.get(int(p.id), ""),
        }
        for p in perguntas
    ]
    return {
        "questionario_id": int(questionario.id),
        "questionario_nome": str(questionario.nome or "").strip(),
        "itens": itens,
    }


@router.put("/pacientes/{paciente_id}/respostas")
def salvar_resposta_paciente(
    paciente_id: int,
    payload: RespostaPayload,
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    _paciente_or_404(db, current_user.clinica_id, paciente_id)
    pergunta = _pergunta_or_404(db, current_user.clinica_id, int(payload.pergunta_id))
    resposta_txt = str(payload.resposta or "").strip()
    atual = (
        db.query(AnamneseResposta)
        .filter(
            AnamneseResposta.clinica_id == current_user.clinica_id,
            AnamneseResposta.paciente_id == int(paciente_id),
            AnamneseResposta.pergunta_id == int(pergunta.id),
        )
        .first()
    )
    if not resposta_txt:
        if atual:
            db.delete(atual)
            db.commit()
        return {"detail": "Resposta limpa."}

    if atual is None:
        atual = AnamneseResposta(
            clinica_id=current_user.clinica_id,
            paciente_id=int(paciente_id),
            questionario_id=int(pergunta.questionario_id),
            pergunta_id=int(pergunta.id),
            resposta=resposta_txt,
        )
        db.add(atual)
    else:
        atual.resposta = resposta_txt
    db.commit()
    return {"detail": "Resposta salva."}
