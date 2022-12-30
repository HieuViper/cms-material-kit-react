import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  Card,
  Container,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import CustomTab from '../../components/tab';
import config from '../../utils/config';
import { call, callUpload } from '../../utils/api';

const AddConstPage = () => {
  const navigate = useNavigate();
  const arr = [0, 1];
  const [dataConst, setDataConst] = useState({
    mainImageURL: '',
    value: '',
    order: 1,
    isActive: true,
    status: '',
    position: '',
  });
  const [dataConstTranslations, setDataConstTranslations] = useState([
    {
      name: '',
      short: '',
      description: '',
      languageId: 1,
    },
    {
      name: '',
      short: '',
      description: '',
      languageId: 2,
    },
  ]);
  console.log('🚀 ~ file: AddConstPage.js:43 ~ AddConstPage ~ dataConstTranslations', dataConstTranslations);
  console.log('🚀 ~ file: AddConstPage.js:19 ~ AddConstPage ~ dataConst', dataConst);

  // image
  const [constImage, setConstImage] = useState();
  const [constImagePreview, setConstImagePreview] = useState();

  // functions
  const changeHandler = (e) => {
    setDataConst({ ...dataConst, [e.target.name]: e.target.value });
  };

  const constImageHandler = (e) => {
    setConstImage(e.target.files[0]);
    setConstImagePreview(URL.createObjectURL(e.target.files[0]));
  };
  const removeImageHandler = () => {
    document.getElementById('fileUpload').value = null;
    setConstImagePreview(undefined);
    setConstImage(null);
  };

  const addConstHandler = () => {
    const formData = new FormData();
    formData.append('file', constImage);

    try {
      const response = callUpload('consts/upload/', 'POST', formData).then((res) => {
        console.log(res);
        const addData = {
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
        console.log(addData);
        call('consts', 'POST', addData);
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
  const pushComponent = (index, inputChangeHandler) => (
    // console.log(name, description, short, index);
    <Stack direction="column" spacing={2} padding={2}>
      <TextField
        label="Name"
        name="name"
        // defaultValue={name}
        value={dataConstTranslations[index].name}
        onChange={(e) => inputChangeHandler(e, index)}
        variant="outlined"
      />
      <TextField
        label="Short"
        name="short"
        value={dataConstTranslations[index].short}
        // defaultValue={short}
        onChange={(e) => inputChangeHandler(e, index)}
        variant="outlined"
      />
      <Box>
        <Typography variant="h6" marginBottom={1}>
          Description :
        </Typography>
        <CKEditor
          editor={ClassicEditor}
          data={dataConstTranslations[index].description}
          onChange={(event, editor) => {
            const data = editor.getData();
            dataConstTranslations[index].description = data;
            console.log(dataConstTranslations);
            setDataConstTranslations([...dataConstTranslations]);
            // console.log(data);
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
  return (
    <Container>
      <Typography variant="h1" component="h2">
        Add Const
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
                  // defaultValue={dataConst.order}
                />
                <TextField
                  id="outlined-basic"
                  label="Code"
                  name="code"
                  variant="outlined"
                  onChange={changeHandler}
                  // defaultValue={dataConst.order}
                />
              </Stack>
              <Stack direction="row" spacing={2}>
                <TextField
                  id="outlined-basic"
                  name="status"
                  label="Status"
                  variant="outlined"
                  onChange={changeHandler}
                  // defaultValue={dataConst.status}
                />
                <TextField
                  id="outlined-basic"
                  name="position"
                  label="Position"
                  variant="outlined"
                  onChange={changeHandler}
                  // defaultValue={dataConst.position}
                />
              </Stack>
              <TextField
                id="outlined-basic"
                name="value"
                label="Value"
                variant="outlined"
                onChange={changeHandler}
                // defaultValue={dataConst.value}
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
                    value={dataConst.isActive}
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
              <TextField id="fileUpload" type="file" accept="image/*" onChange={constImageHandler} />
              <Box sx={{ width: '350px', position: 'relative' }}>
                {dataConst.mainImageURL && (
                  <img
                    style={{ width: '100%', borderRadius: '4px' }}
                    alt=""
                    src={config.apiUrl + dataConst.mainImageURL}
                  />
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
              header={[[{ language: 'Việt Nam', idx: 0 }], [{ language: 'English', idx: 1 }]]}
              bodies={arr.map((item, index) => pushComponent(index, inputChangeHandler))}
            />
          </Card>

          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: 3 }}>
            <Button variant="contained" color="error" onClick={addConstHandler}>
              Add Const
            </Button>
          </Box>
        </Container>
      </Box>
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

export default AddConstPage;
