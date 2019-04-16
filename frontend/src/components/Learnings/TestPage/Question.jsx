import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Button, Typography, Checkbox, FormGroup, FormControlLabel } from '@material-ui/core';
import Sphere from '../../img/photos/sphere.png';
import Lightbox from 'react-images';

export default function Question({ allQuestionsId, paused, findTimer, answered, variants, setChecked, question, questionNumber, skipQuestion, nextQuestion, prevQuestion }) {
  const [images, setImages] = useState([]);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    getImages();
  }, [])

  function getPrevBtnStatus(index) {
    if (!index) return true;
    let status = false;
    if (answered.includes(index - 1)) status = true;
    return status;
  }

  function getImages() {
    if (question.image) {
      const images = [];
      Object.entries(question.image_file).map(item => {
        return images.push({
          src: `http://akvatory.local/${item[1].original.file}`
        })
      })
      setImages(images);
    }   
  }

  function openLightbox() {
    setLightboxOpen(true);
  }

  function closeLightbox() {
    setLightboxOpen(false);
  }

  let checked = variants.length > 0 ? variants.find(variant => variant.checked) : 0;  
 
  return (
    <Container style={findTimer() ? { marginTop: '-93px' } : { marginTop: 40 }}>
      <QuestionHeader>
        <Spheric>
          <Typography variant='h1'>{questionNumber + 1}</Typography>
          <img src={Sphere} alt='' />
        </Spheric>  
        <div className='question-header-text'>
          <Typography variant='h6'>{question.question}</Typography>
          <Typography variant='caption' style={{ marginBottom: 10 }}>{question.category} - {question.subcategory}</Typography>
          {question.audio ?
              question.audio_file.map(item => 
                <audio controls className='question-audio' key={item.id}>
                  <source src={`http://akvatory.local/${item.file}`} />
                </audio> 
              )
          : null}
          {question.image ?
              Object.entries(question.image_file).map((item, i) => 
                <img 
                  onClick={openLightbox}
                  key={item[0]} 
                  style={{ maxWidth: '100%', maxHeight: 300, marginTop: 10, cursor: 'pointer' }} 
                  src={`http://akvatory.local/${item[1].original.file}`} 
                  alt=''
                /> 
              ) 
          : null}
        </div>
      </QuestionHeader>
      <FormGroup className='checkboxes' style={paused ? { pointerEvents: 'none' } : { pointerEvents: 'all' } }>
        {variants.map(variant =>
          <FormControlLabel
            key={variant.id}
            control={
              <Checkbox
                checked={variant.checked}
                onClick={() => setChecked(variant.id)}
              />
            }
            label={variant.item}
          />
        )}
      </FormGroup>
      {!paused ?
      <Buttons>
        <Button onClick={nextQuestion} disabled={checked ? false : true} variant='contained' color='primary'>Далее</Button>
        <Button onClick={prevQuestion} disabled={getPrevBtnStatus(questionNumber)} variant='outlined' color='primary'>Назад</Button>
        <Button onClick={skipQuestion} disabled={allQuestionsId.length - 1 === answered.length} variant='contained' color='secondary'>Пропустить</Button>
      </Buttons>
      : null }

      {question.image ?
        <Lightbox
          images={[...images]}
          isOpen={lightboxOpen}
          onClose={closeLightbox}
          width={1920}
          showImageCount={false}
        />
      : null}


    </Container>
  )
}

const Container = styled.div`
  width: 75%;
  margin-top: 40px;
  .checkboxes {
    margin: 25px 0;
  }
`;
const Buttons = styled.div`
  button {
    margin-right: 30px;
    min-width: 125px;
  }
`;
const QuestionHeader = styled.div`
  display: flex;
  align-items: flex-start;
  .question-header-text {
    width: 525px;
    padding-left: 25px;
    margin-bottom: 20px;
  }
  .question-audio {
    width: 100%;
    :focus, :active {
      outline: 0;
    }
  }
`;
const Spheric = styled.div`
  height: 100px;
  width: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  img {
    width: 100%;
    height: 100%;
  }
  h1 {
    font-size: 48px;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    color: white;
    width: fit-content;
    height: fit-content;
    font-weight: 600;
  }
`;