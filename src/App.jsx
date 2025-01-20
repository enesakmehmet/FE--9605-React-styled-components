import { useState } from "react";
import { Container } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import styled from "styled-components";
import Modal from 'react-bootstrap/Modal';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const Wrapper = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
`;

const TodoItem = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  margin: 5px 0;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  &:hover {
    background-color: #f8f9fa;
  }
`;

const Priority = {
  LOW: "Düşük",
  MEDIUM: "Orta",
  HIGH: "Yüksek"
};

const Categories = {
  WORK: "İş",
  PERSONAL: "Kişisel",
  SHOPPING: "Alışveriş",
  OTHER: "Diğer"
};

function App() {
  const [todoInput, setTodoInput] = useState("");
  const [todos, setTodos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [todoToDelete, setTodoToDelete] = useState(null);
  const [priority, setPriority] = useState("MEDIUM");
  const [category, setCategory] = useState("OTHER");
  const [dueDate, setDueDate] = useState(new Date());
  const [editMode, setEditMode] = useState(false);
  const [editTodo, setEditTodo] = useState(null);

  const handleClose = () => {
    setShowModal(false);
    setEditMode(false);
    setEditTodo(null);
    resetForm();
  };

  const resetForm = () => {
    setTodoInput("");
    setPriority("MEDIUM");
    setCategory("OTHER");
    setDueDate(new Date());
  };

  const addTodo = (event) => {
    event.preventDefault();
    if (!todoInput.trim()) return;

    const newTodo = {
      id: Date.now(),
      text: todoInput,
      priority,
      category,
      dueDate: dueDate.toISOString(),
      completed: false,
      createdAt: new Date().toISOString()
    };

    if (editMode && editTodo) {
      setTodos(todos.map(todo => 
        todo.id === editTodo.id 
          ? { 
              ...todo, 
              text: todoInput, 
              priority, 
              category, 
              dueDate: dueDate.toISOString(),
              lastModified: new Date().toISOString()
            } 
          : todo
      ));
      setEditMode(false);
      setEditTodo(null);
    } else {
      setTodos([...todos, newTodo]);
    }

    resetForm();
  };

  const deleteTodo = () => {
    setTodos(todos.filter((todo) => todo.id !== todoToDelete.id));
    setShowModal(false);
    setTodoToDelete(null);
  };

  const confirmDelete = (todo) => {
    setTodoToDelete(todo);
    setShowModal(true);
  };

  const toggleComplete = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id 
        ? { 
            ...todo, 
            completed: !todo.completed,
            completedAt: !todo.completed ? new Date().toISOString() : null
          } 
        : todo
    ));
  };

  const startEdit = (todo) => {
    setEditMode(true);
    setEditTodo(todo);
    setTodoInput(todo.text);
    setPriority(todo.priority);
    setCategory(todo.category);
    setDueDate(new Date(todo.dueDate));
  };

  const cancelEdit = () => {
    setEditMode(false);
    setEditTodo(null);
    resetForm();
  };

  return (
    <div>
      <Container className="py-4">
        <h1 className="text-center mb-4">Yapılacaklar Listesi</h1>
        <Form onSubmit={addTodo}>
          <Wrapper>
            <Form.Group className="mb-3">
              <Form.Label>Görev</Form.Label>
              <Form.Control
                type="text"
                placeholder="Bir görev ekleyin"
                value={todoInput}
                onChange={(e) => setTodoInput(e.target.value)}
                required
              />
            </Form.Group>

            <div className="row mb-3">
              <div className="col">
                <Form.Group>
                  <Form.Label>Öncelik</Form.Label>
                  <Form.Select value={priority} onChange={(e) => setPriority(e.target.value)}>
                    {Object.entries(Priority).map(([key, value]) => (
                      <option key={key} value={key}>{value}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </div>

              <div className="col">
                <Form.Group>
                  <Form.Label>Kategori</Form.Label>
                  <Form.Select value={category} onChange={(e) => setCategory(e.target.value)}>
                    {Object.entries(Categories).map(([key, value]) => (
                      <option key={key} value={key}>{value}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </div>

              <div className="col">
                <Form.Group>
                  <Form.Label>Bitiş Tarihi</Form.Label>
                  <DatePicker
                    selected={dueDate}
                    onChange={(date) => setDueDate(date)}
                    className="form-control"
                    dateFormat="dd/MM/yyyy"
                    minDate={new Date()}
                  />
                </Form.Group>
              </div>
            </div>

            <div className="d-flex gap-2">
              <Button type="submit" className="flex-grow-1">
                {editMode ? "Güncelle" : "Ekle"}
              </Button>
              {editMode && (
                <Button variant="secondary" onClick={cancelEdit}>
                  İptal
                </Button>
              )}
            </div>
          </Wrapper>
        </Form>

        <Wrapper className="mt-4">
          {todos.map((todo) => (
            <TodoItem key={todo.id}>
              <div className="d-flex align-items-center justify-content-between w-100">
                <div className="d-flex align-items-center">
                  <Form.Check
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleComplete(todo.id)}
                    className="me-3"
                  />
                  <div className={todo.completed ? "text-decoration-line-through" : ""}>
                    <h5 className="mb-1">{todo.text}</h5>
                    <small className="text-muted">
                      {Categories[todo.category]} | {Priority[todo.priority]} | 
                      {new Date(todo.dueDate).toLocaleDateString('tr-TR')}
                      {todo.completed && ` | Tamamlandı: ${new Date(todo.completedAt).toLocaleDateString('tr-TR')}`}
                    </small>
                  </div>
                </div>
                <div>
                  <Button 
                    variant="outline-primary" 
                    size="sm" 
                    className="me-2" 
                    onClick={() => startEdit(todo)}
                    disabled={todo.completed}
                  >
                    Düzenle
                  </Button>
                  <Button variant="outline-danger" size="sm" onClick={() => confirmDelete(todo)}>
                    Sil
                  </Button>
                </div>
              </div>
            </TodoItem>
          ))}
        </Wrapper>
      </Container>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Silme İşlemi</Modal.Title>
        </Modal.Header>
        <Modal.Body>Bu görevi silmek istediğinizden emin misiniz?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Hayır
          </Button>
          <Button variant="danger" onClick={deleteTodo}>
            Evet
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default App;
