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
import config from '../utils/config';
import CustomTab from '../components/tab';
import { call, callGet, callUpload } from '../utils/api';

const EditProductPage = () => {
  const { id } = useParams();
  const toastId = useRef(null);
  const navigate = useNavigate();

  const [products, setProducts] = useState({
    code: '',
    serialImageURL: '',
    status: '',
    active: true,
    pinCode: '',
    isWarranty: true,
    warrantyDay: '',
    description: '',
    name: '',
  });
  console.log('🚀 ~ file: EditProductPage.js:26 ~ EditProductPage ~ products', products);

  // image
  const [serialImage, setSerialImage] = useState();
  console.log('🚀 ~ file: EditProductPage.js:41 ~ EditProductPage ~ serialImage', serialImage);
  const [serialImagePreview, setSerialImagePreview] = useState();

  const [loading, setLoading] = useState(false);

  // for editor

  // functions
  const changeHandler = (e) => {
    setProducts({ ...products, [e.target.name]: e.target.value });
  };
  const serialImageHandler = (e) => {
    setSerialImage(e.target.files[0]);
    setSerialImagePreview(URL.createObjectURL(e.target.files[0]));
    // serialImageGetURL(e.target.files[0]);
  };
  const serialImageGetURL = async (image) => {
    const formData = new FormData();
    formData.append('file', image);
    try {
      const response = await axios({
        method: 'post',
        url: 'https://web-api.zadez.vn/products/upload/',
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setProducts({ ...products, serialImageURL: response.data.url });
    } catch (error) {
      console.log(error);
    }
  };
  const removeImageHandler = () => {
    setSerialImagePreview(undefined);
    setSerialImage(null);
    // setProducts({ ...products, serialImageURL: '' });
  };

  const updateProductHandler = async () => {
    // toast.success('Wow so easy !');
    const formData = new FormData();
    formData.append('file', serialImage);
    try {
      const response = callUpload('products/upload/', 'POST', formData).then((res) => {
        console.log(res);
        const updateData = {
          code: products.code,
          serialImageURL: res.url || products.serialImageURL,
          status: products.status,
          active: products.active,
          pinCode: products.pinCode,
          isWarranty: products.isWarranty,
          warrantyDay: products.warrantyDay,
          productTranslations: [
            {
              name: products.ProductTranslations[0].name,
              description: products.ProductTranslations[0].description,
              languageId: 1,
            },
            {
              name: products.ProductTranslations[1].name,
              description: products.ProductTranslations[1].description,
              languageId: 2,
            },
          ],
        };
        call(`products/update/${id}`, 'PUT', updateData);
        // axios
        //   .put(`https://web-api.zadez.vn/products/update/${id}`, updateData)
        //   .then((item) => {
        //     console.log(item);
        //   })
        //   .catch((err) => console.log(err));
        setProducts({ ...products, serialImageURL: res.url });
      });
      toast.success('Update Successfully', { autoClose: 2000 });
      setTimeout(() => {
        navigate('/dashboard/products-test');
      }, 2000);
    } catch (error) {
      console.log(error);
      toast.error('Something went wrong');
    }
  };

  // funtions for pass prop
  const inputChangeHandler = (e, index, editor) => {
    // if (e.target.name === 'name') {
    //   products.ProductTranslations[index].name = e.target.value;
    //   setProducts({ ...products });
    // } else {
    //   const data = editor.getData();
    //   products.ProductTranslations[index].description = data;
    //   setProducts({ ...products });
    // }
    products.ProductTranslations[index].name = e.target.value;
    setProducts({ ...products });
    // console.log(index);
    // console.log('sau khi an', products);
  };
  const pushComponent = (name, description, index, inputChangeHandler) => (
    <Stack direction="column" spacing={2} padding={2}>
      <TextField
        label="Name"
        name="name"
        defaultValue={name}
        onChange={(e) => inputChangeHandler(e, index)}
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
            products.ProductTranslations[index].description = data;
            setProducts({ ...products });
            // console.log(data);
          }}
          onReady={(editor) => {
            // You can store the "editor" and use when it is needed.
            // console.log("Editor is ready to use!", editor);
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
  //     .get(`https://web-api.zadez.vn/products/${id}`)
  //     .then((res) => {
  //       setProducts(res.data.data[0]);
  //       setLoading(false);
  //     })
  //     .catch((err) => console.log(err));
  // }, []);

  useEffect(() => {
    setLoading(true);
    const data = callGet(`products/${id}`, 'GET', null);
    data.then((response) => {
      setProducts(response.data[0]);
      setLoading(false);
    });
  }, []);

  return (
    <Container>
      {!loading ? (
        <>
          <Typography variant="h1" component="h2">
            Edit Product
          </Typography>

          <Box sx={{ width: '100%' }}>
            <Container>
              <Card sx={{ p: 3, display: 'flex', gap: 3, marginY: 3 }}>
                <Stack direction="column" spacing={2}>
                  <Stack direction="row" spacing={2}>
                    <TextField
                      id="outlined-basic"
                      name="pinCode"
                      label="PinCode"
                      variant="outlined"
                      onChange={changeHandler}
                      defaultValue={products.pinCode}
                    />
                    <TextField
                      id="outlined-basic"
                      label="Code"
                      name="code"
                      variant="outlined"
                      onChange={changeHandler}
                      defaultValue={products.code}
                    />
                  </Stack>
                  <Stack direction="row" spacing={2}>
                    <TextField
                      id="outlined-basic"
                      name="status"
                      label="Status"
                      variant="outlined"
                      onChange={changeHandler}
                      defaultValue={products.status}
                    />
                    <TextField
                      id="outlined-basic"
                      name="warrantyDay"
                      label="Warranty Day"
                      variant="outlined"
                      onChange={changeHandler}
                      defaultValue={products.warrantyDay}
                    />
                  </Stack>
                  <Stack direction="row" spacing={2}>
                    <Box width="100px">
                      <InputLabel id="select-warranty" style={{ fontSize: '12px' }}>
                        Warranty
                      </InputLabel>
                      <Select
                        labelId="select-warranty"
                        name="isWarranty"
                        onChange={changeHandler}
                        variant="outlined"
                        defaultValue={products.isWarranty}
                        label="Warranty"
                        fullWidth
                      >
                        <MenuItem value>Yes</MenuItem>
                        <MenuItem value={false}>No</MenuItem>
                      </Select>
                    </Box>
                    <Box width="100px">
                      <InputLabel id="select-active" style={{ fontSize: '12px' }}>
                        Active
                      </InputLabel>
                      <Select
                        labelId="select-active"
                        name="active"
                        onChange={changeHandler}
                        variant="outlined"
                        label="Active"
                        defaultValue={products.active}
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
                    {products.serialImageURL ? (
                      <img
                        style={{ width: '100%', borderRadius: '4px' }}
                        alt=""
                        src={config.apiUrl + products.serialImageURL}
                      />
                    ) : (
                      <p>Chưa có hình upload</p>
                    )}
                    {serialImagePreview && (
                      <img
                        style={
                          products.serialImageURL === '' || products.serialImageURL === ''
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
                    products.ProductTranslations &&
                    products.ProductTranslations.map((item, index) => [{ language: item.Language.name, idx: index }])
                  }
                  bodies={
                    products.ProductTranslations &&
                    products.ProductTranslations.map((item, index) =>
                      pushComponent(item.name, item.description, index, inputChangeHandler)
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

export default EditProductPage;
