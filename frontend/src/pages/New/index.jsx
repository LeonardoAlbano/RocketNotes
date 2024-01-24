import { useState} from 'react';
import { Header } from '../../components/Header';
import { Input } from '../../components/Input';
import { Textarea } from '../../components/Textarea';
import { NoteItem } from '../../components/NoteItem';
import { Section } from '../../components/Section';
import { Button } from '../../components/Button';
import { ButtonText } from '../../components/ButtonText';

import { useNavigate } from 'react-router-dom';

import { api } from '../../services/api';

import { Container, Form } from "./styles";

export function New() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const [links, setLinks] = useState([]);
    const [newLink, setNewLink] = useState("");

    const [tags, setTags] = useState([]);
    const [newTag, setNewTag] = useState("");

    const navigate = useNavigate();

    function handleBack(){
        navigate(-1)
    }
    

    function handleAddLink() {
        setLinks(prevState => [...prevState, newLink]);
        setNewLink("");
    }

    function handleRemoveLink(deleted) {
        setLinks((prev) => prev.filter((link, index) => index !== deleted));
    }

    function handleAddTag() {
        setTags(prevState => [...prevState, newTag]);
        setNewTag("");
    }

    function handleRemoveTag(deleted) {
        setTags((prev) => prev.filter((tag, index) => index !== deleted))
    }

    async function handleNewNote() {
        if(!title){
            return alert("Digite o titulo da nota")
        }
        
        if(newLink){
            return alert("Adicione o Link se não ficará vazio")
        }

        if(newTag){
            return alert("Adicione a tag se não ficará vazio")
        }


       await api.post("/notes", {
        title,
        description,
        tags,
        links
       }); 

       alert("Nota criada com sucesso!");
       navigate(-1)
    }
    
    return(
        <Container>
            <Header />

            <main>
                <Form>
                    <header>
                        <h1>Criar nota</h1>
                        
                        <ButtonText 
                            onClick={handleBack}
                            title="Voltar"
                        />

                    </header>

                    <Input 
                        placeholder="Titulo" 
                        onChange = {e => setTitle(e.target.value)}
                    />

                    <Textarea 
                        placeholder="Oberservações" 
                        onChange = {e => setDescription(e.target.value)}
                    />

                    <Section title="Links Uteis">
                        {
                            links.map((link, index) => (
                                <NoteItem        
                                    key={String(index)}                 
                                    value={link}
                                    onClick={() => handleRemoveLink(index)}
                            />
                            ))
                        }
                        <NoteItem 
                            isNew 
                            placeholder = "Novo link"
                            value={newLink}
                            onChange = {e => setNewLink(e.target.value)}    
                            onClick={handleAddLink}
                        />
                    </Section>

                    <Section title="Marcadores">
                        <div className='tags'>
                            {
                                tags.map((tag, index) => (
                                    <NoteItem 
                                        key={String(index)}
                                        value={tag}
                                        onClick={() => handleRemoveTag(index)}    
                                /> 
                                ))
                            }
                            
                            <NoteItem 
                                isNew 
                                placeholder="Nova Tag"
                                onChange = {e => setNewTag(e.target.value)}
                                value={newTag}
                                onClick={handleAddTag}    
                            />                            
                        </div>
                    </Section>

                    <Button 
                        title="Salvar" 
                        onClick={handleNewNote}
                    />
                </Form>
            </main>
        </Container>
    )
}