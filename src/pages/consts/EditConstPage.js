import { toast, ToastContainer } from 'react-toastify';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {
  Box,
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
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import config from '../../utils/config';
import { callGet, callUpload, call } from '../../utils/api';
import CustomTab from '../../components/tab/CustomTab';

const EditConstPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [dataConst, setDataConst] = useState({
    mainImageURL: '',
    value: '',
    order: 1,
    isActive: true,
    status: '',
    position: '',
    name: '',
    short: '',
    description: '',
  });
  const [dataConstTranslations, setDataConstTranslations] = useState([]);
  console.log('🚀 ~ file: EditConstPage.js:37 ~ EditConstPage ~ dataConstTranslations', dataConstTranslations);
  console.log('🚀 ~ file: EditConstPage.js:9 ~ EditConstPage ~ dataConst', dataConst);

  // image
  const [constImage, setConstImage] = useState();
  const [constImagePreview, setConstImagePreview] = useState();

  // custom-tab
  const pushComponent = (name, description, short, index, inputChangeHandler) => (
    // console.log(name, description, short, index);
    <Stack direction="column" spacing={2} padding={2}>
      <TextField
        label="Name"
        name="name"
        defaultValue={name}
        onChange={(e) => inputChangeHandler(e, index)}
        variant="outlined"
      />
      <TextField
        label="Short"
        name="short"
        defaultValue={short}
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
            dataConstTranslations[index].description = data;
            console.log(dataConstTranslations);
            setDataConstTranslations([...dataConstTranslations]);
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
  const inputChangeHandler = (e, index) => {
    console.log(index);
    setDataConstTranslations((current) =>
      current.map((obj) => {
        if (e.target.name === 'name') {
          console.log('day la tab 0');
          dataConstTranslations[index].name = e.target.value;
          setDataConstTranslations([...dataConstTranslations]);
          return { ...obj };
        }
        if (e.target.name === 'short') {
          dataConstTranslations[index].short = e.target.value;
          setDataConstTranslations([...dataConstTranslations]);
          return { ...obj };
        }

        return { ...obj };
      })
    );
  };

  // functions
  const changeHandler = (e) => {
    setDataConst({ ...dataConst, [e.target.name]: e.target.value });
  };
  const constImageHandler = (e) => {
    setConstImage(e.target.files[0]);
    setConstImagePreview(URL.createObjectURL(e.target.files[0]));
  };
  const removeImageHandler = (e) => {
    setConstImagePreview(undefined);
    setConstImage(null);
  };

  const updateProductHandler = async () => {
    // toast.success('Wow so easy !');
    const formData = new FormData();
    formData.append('file', constImage);
    try {
      const response = callUpload('consts/upload/', 'POST', formData).then((res) => {
        console.log(res);
        const updateData = {
          mainImageURL: res.url || dataConst.mainImageURL,
          value: dataConst.value,
          status: dataConst.status,
          order: dataConst.order,
          isActive: dataConst.isActive,
          position: dataConst.position,
          constTranslations: [
            {
              name: dataConstTranslations[0].name,
              short: dataConstTranslations[0].short,
              description: dataConstTranslations[0].description,
              languageId: 1,
            },
            {
              name: dataConstTranslations[1].name,
              short: dataConstTranslations[1].short,
              description: dataConstTranslations[1].description,
              languageId: 2,
            },
          ],
        };
        console.log(updateData);
        call(`consts/${id}`, 'PUT', updateData);
        // axios
        //   .put(`https://web-api.zadez.vn/products/update/${id}`, updateData)
        //   .then((item) => {
        //     console.log(item);
        //   })
        //   .catch((err) => console.log(err));
        setDataConst({ ...dataConst, mainImageURL: res.url });
      });
      toast.success('Update Successfully', { autoClose: 2000 });
      setTimeout(() => {
        navigate('/dashboard/consts');
      }, 2000);
    } catch (error) {
      console.log(error);
      // toast.error('Something went wrong');
    }
  };

  useEffect(() => {
    setLoading(true);
    const data = callGet(`consts/${id}`, 'GET', null);
    data.then((response) => {
      console.log(response);
      setDataConst(response.consts);
      setDataConstTranslations(response.constTranslations);
      setLoading(false);
    });
  }, []);
  return (
    <Container>
      {!loading ? (
        <>
          <Typography variant="h1" component="h2">
            Edit Const
          </Typography>

          <Box sx={{ width: '100%' }}>
            <Container>
              <Card sx={{ p: 3, display: 'flex', gap: 3, marginY: 3 }}>
                <Stack direction="column" spacing={2}>
                  <Stack direction="row" spacing={2}>
                    <TextField
                      id="outlined-basic"
                      name="order"
                      label="Order"
                      variant="outlined"
                      onChange={changeHandler}
                      defaultValue={dataConst.order}
                    />
                    <TextField
                      id="outlined-basic"
                      label="Code"
                      name="code"
                      variant="outlined"
                      onChange={changeHandler}
                      defaultValue={dataConst.order}
                    />
                  </Stack>
                  <Stack direction="row" spacing={2}>
                    <TextField
                      id="outlined-basic"
                      name="status"
                      label="Status"
                      variant="outlined"
                      onChange={changeHandler}
                      defaultValue={dataConst.status}
                    />
                    <TextField
                      id="outlined-basic"
                      name="position"
                      label="Position"
                      variant="outlined"
                      onChange={changeHandler}
                      defaultValue={dataConst.position}
                    />
                  </Stack>
                  <TextField
                    id="outlined-basic"
                    name="value"
                    label="Value"
                    variant="outlined"
                    onChange={changeHandler}
                    defaultValue={dataConst.value}
                  />
                  <Stack direction="row" spacing={2}>
                    <Box width="100px">
                      <InputLabel id="select-active" style={{ fontSize: '12px' }}>
                        Active
                      </InputLabel>
                      <Select
                        labelId="select-active"
                        name="isActive"
                        onChange={changeHandler}
                        variant="outlined"
                        label="Active"
                        defaultValue={dataConst.isActive}
                        fullWidth
                      >
                        <MenuItem value>Yes</MenuItem>
                        <MenuItem value={false}>No</MenuItem>
                      </Select>
                    </Box>
                  </Stack>
                </Stack>
                <Stack direction="column" spacing={2}>
                  <TextField type="file" accept="image/*" onChange={constImageHandler} />
                  <Box sx={{ width: '350px', position: 'relative' }}>
                    {dataConst.mainImageURL ? (
                      <img
                        style={{ width: '100%', borderRadius: '4px' }}
                        alt=""
                        src={config.apiUrl + dataConst.mainImageURL}
                      />
                    ) : (
                      <p>Chưa có hình upload</p>
                    )}
                    {constImagePreview && (
                      <img
                        style={
                          dataConst.mainImageURL === '' || dataConst.mainImageURL === ''
                            ? { position: 'relative', width: '100%', borderRadius: '4px' }
                            : { position: 'absolute', bottom: 0, right: 0, width: '100px', borderRadius: '4px' }
                        }
                        src={constImagePreview}
                        alt=""
                      />
                    )}
                  </Box>
                  {constImagePreview && (
                    <Button variant="outlined" color="error" onClick={removeImageHandler}>
                      Remove Image Preview
                    </Button>
                  )}
                </Stack>
              </Card>

              <Card sx={{ p: 3, display: 'flex', gap: 3 }}>
                <CustomTab
                  header={
                    dataConstTranslations &&
                    dataConstTranslations.map((item, index) => [
                      { language: item.languageId === 1 ? 'Việt Nam' : 'English', idx: index },
                    ])
                  }
                  bodies={
                    dataConstTranslations &&
                    dataConstTranslations.map((item, index) =>
                      pushComponent(item.name, item.description, item.short, index, inputChangeHandler)
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
        autoClose={2000}
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

export default EditConstPage;
