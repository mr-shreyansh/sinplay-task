import Image from 'next/image'
import { Inter } from 'next/font/google'
import images from '../data/images';
import { useEffect, useState } from 'react';
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const [query, setQuery] = useState('');

  // A state variable to store the id of the selected image
  const [selectedId, setSelectedId] = useState(null);
  const [pics, setPics] = useState([]);
  const [newPic, setNewPic] = useState({
    id: pics.length + 1,
    url: '',
    description: ''
  });



  useEffect(() => {

    const fetchData = async () => {
      try {
        const data = await import('../data/images');
        setPics(data.images);
       
      }
      catch (error) {
        console.log(error);
      }

    };
    fetchData();

  }, []);


  const handleClick = (id) => {
    // Set the selected id to the clicked image id
    if (selectedId === null)
      setSelectedId(id);
    else {
      setSelectedId(null)
    }

  };

  const handleUrlChange = (event) => {
    // get the new url from the event target
    const newUrl = event.target.value
    // update the state with the new url and the old description
    setNewPic({
      url: newUrl,
      description: newPic.description
    })
  }
  
  const handleDescriptionChange = (event) => {
    // get the new description from the event target
    const newDescription = event.target.value
    // update the state with the new description and the old url
    setNewPic({
      url: newPic.url,
      description: newDescription
    })
  }
  
  const updatePics = () => {
    // add the new pic to the pics array
    console.log(pics)
    setPics([...pics, newPic])
    updateData(pics);
    // reset the newPic state
    setNewPic({
      id: pics.length + 1,
      url: '',
      description: ''
    })
  }
   
const handleDragEnd = (result) => {
  if (!result.destination) return;
  const items = Array.from(pics);
  const [reorderedItem] = items.splice(result.source.index, 1);
  items.splice(result.destination.index, 0, reorderedItem);
  setPics(items);
};

  return (
    <main>
      <div className='flex justify-center'>
        <input type='text' className='self-center px-3 py-1 my-5 bg-gray-100 border' placeholder='search' onChange={(e) => setQuery(e.target.value)} />
      </div>
         <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId='list'>
           {
             (provided) => (
              <list {...provided.droppableProps} ref={provided.innerRef} className='flex flex-col items-center gap-2 sm:gap-7 sm:flex-row sm:flex-wrap sm:justify-center'>
              {pics.filter((val) => {
                if (query == "")
                  return val
                else if (val.description.toLowerCase().includes(query.toLocaleLowerCase())) {
                  return val
                }
              }).map((image, index) => (
                <Draggable key={image.id} draggableId={image.id.toString()} index={index}>
                  {
                    (provided) => (
                      <div className='relative' ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                  <Image
                    src={image.url}
                    alt="des"
                    width={200}
                    height={300}
      
                    onClick={() => handleClick(image.id)}
                    className={`relative rounded-lg shadow-lg shadow-gray-400 hover:border hover:border-purple-600 transition-all ease-in  ${selectedId === image.id ? ' z-20' : 'relative z-0'}`}
                    // Use a ternary operator to apply the scale value based on the selected id
                    style={{ transform: `scale(${selectedId === image.id ? 1.5 : 1})` }}
                  />{
                    selectedId === image.id ?
                      <p className='absolute z-50 text-lg font-light text-center text-white bottom-3 left-2 right-2'>{image.description}</p>
                      : null
                  }
                </div>
                    )
                  }
                
                </Draggable>
              ))}
          </list>
            )
           }
       
        </Droppable>
        </DragDropContext>
      <div className='flex flex-col bg-gray-200 mt-9'>
         <h1 className='mt-3 font-light text-center'>Upload your own images using url</h1>
      <div className='flex flex-col items-center bg-gray-200 md:flex-row md:justify-center md:gap-7'>
        <input type='text' className='px-3 py-1 my-5 bg-gray-100 border' placeholder='image url' value={newPic.url} onChange={handleUrlChange } />
        <input type='text' className='px-3 py-1 my-5 bg-gray-100 border' placeholder='image description' value={newPic.description} onChange={handleDescriptionChange}/>
        <button 
        className='px-3 py-1 my-5 bg-purple-300 border rounded-md'
        onClick={()=>{ 
    setPics([...pics, newPic])
    setNewPic({
      id: pics.length + 1,
      url: '',
      description: ''
    })}}>submit</button>
        
      </div>
      </div>
    </main>
  )
}