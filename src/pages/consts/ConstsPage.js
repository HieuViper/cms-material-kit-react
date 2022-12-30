import axios from 'axios';
import { styled } from '@mui/system';
import { Helmet } from 'react-helmet-async';
import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import {
  Box,
  Button,
  Card,
  CircularProgress,
  Container,
  IconButton,
  MenuItem,
  Modal,
  Popover,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
// components
import Scrollbar from '../../components/scrollbar/Scrollbar';
import config from '../../utils/config';
import Iconify from '../../components/iconify';
import { call, callGet } from '../../utils/api';
import { authContext } from '../../utils/Auth';
// ----------------------------------------------------------------------

const StyleditemImg = styled('img')({
  top: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute',
});
export default function ConstsPage() {
  const navigate = useNavigate();
  // const userData = useContext(authContext);
  // console.log(
  //   '🚀 ~ file: ConstsPage.js:44 ~ ConstsPage ~ authContext',
  //   userData.roles.map((item) => console.log(item))
  // );
  const userData = useContext(authContext);
  const [roles, setRoles] = useState();
  console.log('🚀 ~ file: ConstsPage.js:50 ~ ConstsPage ~ roles', roles);
  const [dataConsts, setDataConsts] = useState();
  const [openMenu, setOpenMenu] = useState();
  const [currentSelectitem, setCurrentSelectitem] = useState();
  const [loading, setLoading] = useState(false);

  // functions
  const addConstHandler = () => {
    navigate('/dashboard/add-const');
  };

  const handleOpenMenu = (event) => {
    setCurrentSelectitem(JSON.parse(event.currentTarget.dataset.currentitem));
    console.log('🚀 ~ file: ConstsPage.js:60 ~ handleOpenMenu ~ CurrentSelectitem', currentSelectitem);
    setOpenMenu(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenu(null);
  };

  const handleOpenEdit = () => {
    if (roles && (roles.includes('admin') || roles.includes('system'))) {
      navigate(`/dashboard/edit-const/${currentSelectitem.id}`, { state: currentSelectitem });

      console.log('🚀 ~ file: ConstsPage.js:70 ~ handleOpenEdit ~ currentSelectitem', currentSelectitem);
    } else {
      alert('Ban khong co quyen sua');
    }
  };
  console.log('🚀 ~ file: ConstsPage.js:73 ~ handleOpenEdit ~ currentSelectitem', currentSelectitem);

  const handleDelete = () => {
    if (roles && roles.includes('system')) {
      call(`consts/${currentSelectitem.id}`, 'DELETE');
      setOpenMenu(null);
      setLoading(true);
      const data = callGet(`consts`, 'GET', null);
      data.then((response) => {
        setDataConsts(response.data);
        setLoading(false);
      });
    } else {
      alert('Ban khong co quyen xoa');
    }
  };

  useEffect(() => {
    setLoading(true);
    const data = callGet(`consts`, 'GET', null);
    data.then((response) => {
      setDataConsts(response.data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    setRoles(userData.roles);
  }, []);

  return (
    <>
      <Helmet>
        <title> Dashboard: Consts | Minimal UI </title>
      </Helmet>

      <Container>
        <Typography variant="h4" sx={{ mb: 5 }}>
          Consts table
        </Typography>

        <Card>
          <Stack
            direction="row"
            flexWrap="wrap-reverse"
            alignItems="center"
            justifyContent="flex-end"
            sx={{ mb: 3, mt: 3 }}
          >
            <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1, mx: 1 }}>
              <Button variant="contained" onClick={addConstHandler}>
                Add Consts
              </Button>
            </Stack>
          </Stack>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align="left">Image</TableCell>
                    <TableCell align="left">Order</TableCell>
                    <TableCell align="left">Position</TableCell>
                    <TableCell align="left">Status</TableCell>
                    <TableCell align="left">Value</TableCell>
                    <TableCell align="left">Active</TableCell>
                    <TableCell align="left" />
                  </TableRow>
                </TableHead>

                <TableBody>
                  {loading ? (
                    <Box
                      sx={{
                        p: 2,
                        display: 'flex',
                        justifyContent: 'center',
                      }}
                    >
                      <CircularProgress />
                    </Box>
                  ) : (
                    dataConsts &&
                    dataConsts.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell align="left">
                          <Box sx={{ pt: '100%', position: 'relative' }}>
                            <StyleditemImg
                              alt={item.ConstTranslations[0].name}
                              src={config.apiUrl + item.mainImageURL}
                            />
                          </Box>
                        </TableCell>
                        {/* <TableCell align="left">
                          <Box sx={{ pt: '100%', position: 'relative' }}>
                            <StyleditemImg alt={item.serialImageURL} src={config.apiUrl + item.serialImageURL} />
                          </Box>
                        </TableCell> */}
                        <TableCell align="left">{item.order}</TableCell>
                        <TableCell align="left">{item.position}</TableCell>
                        <TableCell align="left">{item.status}</TableCell>
                        <TableCell align="left">{item.value}</TableCell>
                        <TableCell align="left">{item.isActive ? 'Yes' : 'No'}</TableCell>
                        <TableCell align="right">
                          <IconButton
                            size="large"
                            color="inherit"
                            onClick={handleOpenMenu}
                            data-currentitem={JSON.stringify(item)}
                          >
                            <Iconify icon={'eva:more-vertical-fill'} />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>
        </Card>

        <Popover
          open={Boolean(openMenu)}
          anchorEl={openMenu}
          onClose={handleCloseMenu}
          anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          PaperProps={{
            sx: {
              p: 1,
              width: 140,
              '& .MuiMenuItem-root': {
                px: 1,
                typography: 'body2',
                borderRadius: 0.75,
              },
            },
          }}
        >
          <MenuItem sx={{ color: 'info.main' }} onClick={handleOpenEdit}>
            <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
            Edit
          </MenuItem>

          <MenuItem sx={{ color: 'error.main' }} onClick={handleDelete}>
            <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
            Delete
          </MenuItem>
        </Popover>
      </Container>
    </>
  );
}
