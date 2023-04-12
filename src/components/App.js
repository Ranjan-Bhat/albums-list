import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import AddAlbum from './AddAlbum';
import AlbumsList from './AlbumsList';
import UpdateAlbum from './UpdateAlbum';

export default function App() {
  const [albums, setAlbums] = useState([]);
  const [updateAlbum, setUpdateAlbum] = useState({});

  useEffect(() => {
    // const fetchAlbums = async () => {
    //   const response = await fetch(
    //     'https://jsonplaceholder.typicode.com/albums'
    //   );
    //   const albumsData = await response.json();
    //   setAlbums(albumsData);
    // };
    // fetchAlbums();
    fetch('https://jsonplaceholder.typicode.com/albums')
    .then(res => res.json())
    .then(data => setAlbums(data))
    .catch(err => console.log(err));
  }, []);

  const deleteAlbumFromList = (id) => {
    fetch(`https://jsonplaceholder.typicode.com/albums/${id}`, {
      method: 'DELETE',
    });
    const newAlbums = albums.filter((album) => album.id !== id);
    alert('Your Album Deleted successfully');
    setAlbums(newAlbums);
  };

  const updateAlbumInList = async (id, updateTitle, updateUserid, oldAlbum) => {
    const index = albums.indexOf(oldAlbum);
    let updatedAlbum = [];
    if (id < 100) {
      updatedAlbum = await fetch(
        `https://jsonplaceholder.typicode.com/albums/${id}`,
        {
          method: 'PUT',
          body: JSON.stringify({
            userId: updateUserid,
            id: id,
            title: updateTitle,
          }),
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
        }
      )
        .then((response) => response.json())
        .then((json) => json);
    } else {
      updatedAlbum = {
        userId: updateUserid,
        id: id,
        title: updateTitle,
      };
    }
    const updatedAlbums = [...albums];
    updatedAlbums[index] = updatedAlbum;
    setAlbums(updatedAlbums);
    alert('Update Successfully done');
  };

  const addAlbumToList = (userId, title) => {
    fetch('https://jsonplaceholder.typicode.com/albums', {
      method: 'POST',
      body: JSON.stringify({
        userId: userId,
        id: albums.length + 1,
        title: title,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((response) => response.json())
      .then((json) => {
        const album = {
          userId: json.userId,
          id: json.id,
          title: json.title,
        };
        setAlbums([...albums, album]);
        alert('New Album added successfully in the bottom');
      });
  };

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <AlbumsList
              albums={albums}
              setUpdateAlbum={setUpdateAlbum}
              deleteAlbumFromList={deleteAlbumFromList}
            />
          }
        />
        <Route
          path="/add-album"
          element={<AddAlbum addAlbumToList={addAlbumToList} />}
        />
        <Route
          path="/update-album"
          element={<UpdateAlbum album={updateAlbum} updateAlbumInList={updateAlbumInList} />}
        />
      </Routes>
    </>
  );
}
