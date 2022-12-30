import React, { useEffect, useRef, useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Box } from '@mui/system';
import { toast, ToastContainer } from 'react-toastify';
import {
  Button,
  Card,
  CircularProgress,
  Container,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import config from '../../utils/config';
import CustomTab from '../../components/tab';
import { call, callGet, callUpload } from '../../utils/api';

const EditArticlesPage = () => {
  const { id } = useParams();
  const toastId = useRef(null);
  const navigate = useNavigate();

  const [articles, setArticles] = useState({
    code: '',
    mainImageURL: '',
    status: '',
    // active: true,
    pinCode: '',
    isWarranty: true,
    warrantyDay: '',
    description: '',
    name: '',
  });
  // console.log('🚀 ~ file: EditProductPage.js:26 ~ EditProductPage ~ articles', articles);

  // image
  const [mainImageURL, setMainImageURL] = useState();
  // console.log('🚀 ~ file: EditProductPage.js:41 ~ EditProductPage ~ serialImage', serialImage);
  const [serialImagePreview, setSerialImagePreview] = useState();

  const [loading, setLoading] = useState(false);

  // for editor

  // functions
  const changeId = (e) => {
    articles.articles.id = e.target.value
    setArticles({ ...articles })

    // setArticles({ ...articles, [e.target.id]: e.target.value });
  };
  const changeActive = (e) => {
    articles.articles.active = e.target.value
    setArticles({ ...articles })

    // setArticles({ ...articles, [e.target.active]: e.target.value });
  };
  const changeStatus = (e) => {
    articles.articles.status = e.target.value

    setArticles({ ...articles })

    // setArticles({ ...articles, [e.target.status]: e.target.value });
  };


  const serialImageHandler = (e) => {
    setMainImageURL(e.target.files[0]);
    setSerialImagePreview(URL.createObjectURL(e.target.files[0]));
    // serialImageGetURL(e.target.files[0]);
  };
  const serialImageGetURL = async (image) => {
    const formData = new FormData();
    formData.append('file', image);
    try {
      const response = await axios({
        method: 'post',
        url: 'https://web-api.zadez.vn/articles/upload/',
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setArticles({ ...articles, serialImageURL: response.data.url });
    } catch (error) {
      console.log(error);
    }
  };
  console.log(articles?.articles?.status)
  const removeImageHandler = () => {
    setSerialImagePreview(undefined);
    setMainImageURL(null);
    // setarticles({ ...articles, serialImageURL: '' });
  };

  const updateProductHandler = async () => {
    // toast.success('Wow so easy !');
    const formData = new FormData();
    formData.append('file', mainImageURL);
    try {
      const response = callUpload('articles/upload/', 'POST', formData).then((res) => {
        console.log(res);
        const updateData = {
          id: articles.articles.id,
          mainImageURL: res.url || articles.articles.mainImageURL,
          status: articles.articles.status,
          isActive: articles.articles.isActive,
          articleTranslations: [
            {
              name: articles.articleTranslations[0].name,
              short: articles.articleTranslations[0].short,
              description: articles.articleTranslations[0].description,
              languageId: 1,
            },
            {
              name: articles.articleTranslations[1].name,
              short: articles.articleTranslations[1].short,
              description: articles.articleTranslations[1].description,
              languageId: 2,
            },
          ],
        };
        call(`articles/${id}`, 'PUT', updateData);
        // axios
        //   .put(`https://web-api.zadez.vn/articles/update/${id}`, updateData)
        //   .then((item) => {
        //     console.log(item);
        //   })
        //   .catch((err) => console.log(err));
        setArticles({ ...articles, serialImageURL: res.url });
      });
      toast.success('Update Successfully', { autoClose: 2000 });
      setTimeout(() => {
        navigate('/dashboard/articles');
      }, 2000);
    } catch (error) {
      console.log(error);
      toast.error('Something went wrong');
    }
  };

  // funtions for pass prop
  const inputChangeName = (e, index, editor) => {
    articles.articleTranslations[index].name = e.target.value;
    setArticles({ ...articles });
  };

  const inputChangeShort = (e, index, editor) => {
    articles.articleTranslations[index].short = e.target.value;
    setArticles({ ...articles });
  };

  const pushComponent = (name, short, description, index, inputChangeName, inputChangeShort) => (
    <Stack direction="column" spacing={2} padding={2}>
      <TextField
        label="Name"
        name="name"
        defaultValue={name}
        onChange={(e) => inputChangeName(e, index)}
        variant="outlined"
      />
      <TextField
        label="Short"
        name="short"
        defaultValue={short}
        onChange={(e) => inputChangeShort(e, index)}
        variant="outlined"
      />
      <Box>
        <Typography variant="h6" marginBottom={1}>
          Description :
        </Typography>
        <CKEditor
          editor={ClassicEditor}
          data={description}
          onChange={(event, editor) => {
            const data = editor.getData();
            articles.articleTranslations[index].description = data;
            setArticles({ ...articles });
            console.log(articles);
          }}
          onReady={(editor) => {
            editor.editing.view.change((writer) => {
              writer.setStyle('height', '200px', editor.editing.view.document.getRoot());
            });
          }}
          name="description"
        />
      </Box>
    </Stack>
  );

  // useEffect(() => {
  //   setLoading(true);
  //   axios
  //     .get(`https://web-api.zadez.vn/articles/${id}`)
  //     .then((res) => {
  //       setarticles(res.data.data[0]);
  //       setLoading(false);
  //     })
  //     .catch((err) => console.log(err));
  // }, []);

  useEffect(() => {
    setLoading(true);
    const data = callGet(`articles/${id}`, 'GET', null);
    data.then((response) => {
      setArticles(response);
      setLoading(false);

      console.log(articles.articles.mainImageURL)
    });
  }, []);

  return (
    <Container>
      {!loading ? (
        <>
          <Typography variant="h1" component="h2">
            Edit Articles
          </Typography>

          <Box sx={{ width: '100%' }}>
            <Container>
              <Card sx={{ p: 3, display: 'flex', gap: 3, marginY: 3 }}>
                <Stack direction="column" spacing={2}>
                  <Stack direction="row" spacing={2}>
                    <TextField
                      id="outlined-basic"
                      name="id"
                      label="id"
                      variant="outlined"
                      onChange={changeId}
                      defaultValue={articles?.articles?.id}
                    />
                  </Stack>
                  <Stack direction="row" spacing={2}>
                    <TextField
                      id="outlined-basic"
                      name="status"
                      label="Status"
                      variant="outlined"
                      onChange={changeStatus}
                      defaultValue={articles?.articles?.status}
                    />
                  </Stack>
                  <Stack direction="row" spacing={2}>
                    <Box width="100px">
                      <InputLabel id="select-active" style={{ fontSize: '12px' }}>
                        Active
                      </InputLabel>
                      <Select
                        labelId="select-active"
                        name="active"
                        onChange={changeActive}
                        variant="outlined"
                        label="Active"
                        defaultValue={articles?.articles?.isActive}
                        fullWidth
                      >
                        <MenuItem value>Yes</MenuItem>
                        <MenuItem value={false}>No</MenuItem>
                      </Select>
                    </Box>
                  </Stack>
                </Stack>
                <Stack direction="column" spacing={2}>
                  <TextField type="file" accept="image/*" onChange={serialImageHandler} />
                  <Box sx={{ width: '350px', position: 'relative' }}>
                    {articles?.articles?.mainImageURL ? (
                      <img
                        style={{ width: '100%', borderRadius: '4px' }}
                        alt=""
                        src={config.apiUrl + articles?.articles?.mainImageURL}
                      />
                    ) : (
                      <p>Chưa có hình upload</p>
                    )}
                    {serialImagePreview && (
                      <img
                        style={
                          articles.serialImageURL === '' || articles.serialImageURL === ''
                            ? { position: 'relative', width: '100%', borderRadius: '4px' }
                            : { position: 'absolute', bottom: 0, right: 0, width: '100px', borderRadius: '4px' }
                        }
                        src={serialImagePreview}
                        alt=""
                      />
                    )}
                  </Box>
                  {serialImagePreview && (
                    <Button variant="outlined" color="error" onClick={removeImageHandler}>
                      Remove Image Preview
                    </Button>
                  )}
                </Stack>
              </Card>

              <Card sx={{ p: 3, display: 'flex', gap: 3 }}>
                <CustomTab
                  header={
                    articles.articleTranslations &&
                    articles.articleTranslations.map((item, index) => [{ language: item.name, idx: index }])
                  }
                  bodies={
                    articles.articleTranslations &&
                    articles.articleTranslations.map((item, index) =>
                      pushComponent(item.name, item.short, item.description, index, inputChangeName, inputChangeShort)
                    )
                  }
                />
              </Card>

              <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: 3 }}>
                <Button variant="contained" color="error" onClick={updateProductHandler}>
                  Update
                </Button>
              </Box>
            </Container>
          </Box>
        </>
      ) : (
        <CircularProgress />
      )}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </Container>
  );
};

export default EditArticlesPage;
