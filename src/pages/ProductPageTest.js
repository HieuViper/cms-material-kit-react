import axios from 'axios';
import { styled } from '@mui/system';
import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import {
  Box,
  Button,
  Card,
  Checkbox,
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
import { ProductSort, ProductList, ProductCartWidget, ProductFilterSidebar } from '../sections/@dashboard/products';
// mock
import PRODUCTS from '../_mock/products';
import Scrollbar from '../components/scrollbar/Scrollbar';
import Label from '../components/label/Label';
import { ColorPreview } from '../components/color-utils';
import config from '../utils/config';
import Iconify from '../components/iconify';
// ----------------------------------------------------------------------

const StyledProductImg = styled('img')({
  top: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute',
});
export default function ProductsPageTest() {
  const navigate = useNavigate();
  const [openFilter, setOpenFilter] = useState(false);
  const [dataProduct, setDataProduct] = useState();
  const [openMenu, setOpenMenu] = useState();
  const [currentSelectProduct, setCurrentSelectProduct] = useState();
  const [loading, setLoading] = useState(false);
  console.log('🚀 ~ file: ProductPageTest.js:51 ~ ProductsPageTest ~ loading', loading);

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  const handleOpenMenu = (event) => {
    setCurrentSelectProduct(JSON.parse(event.currentTarget.dataset.currentproduct));
    setOpenMenu(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenu(null);
  };

  const handleOpenEdit = () => {
    console.log(currentSelectProduct);
    navigate(`/dashboard/edit-product/${currentSelectProduct.id}`, { state: currentSelectProduct });
  };

  console.log(dataProduct);

  useEffect(() => {
    setLoading(true);
    axios
      .get('https://web-api.zadez.vn/products')
      .then((res) => {
        setDataProduct(res.data.data);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      <Helmet>
        <title> Dashboard: Products | Minimal UI </title>
      </Helmet>

      <Container>
        <Typography variant="h4" sx={{ mb: 5 }}>
          Products table
        </Typography>

        {/* <ProductList products={PRODUCTS} /> */}
        {/* <ProductCartWidget /> */}
        <Card>
          <Stack
            direction="row"
            flexWrap="wrap-reverse"
            alignItems="center"
            justifyContent="flex-end"
            sx={{ mb: 3, mt: 3 }}
          >
            <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
              <ProductFilterSidebar
                openFilter={openFilter}
                onOpenFilter={handleOpenFilter}
                onCloseFilter={handleCloseFilter}
              />
              <ProductSort />
            </Stack>
          </Stack>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align="left">Image</TableCell>
                    <TableCell align="left">Name</TableCell>
                    <TableCell align="left">SerialImage</TableCell>
                    <TableCell align="left">PinCode</TableCell>
                    <TableCell align="left">Active</TableCell>
                    <TableCell align="left">Status</TableCell>
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
                    dataProduct &&
                    dataProduct.map((product, index) => (
                      <TableRow key={product.id}>
                        <TableCell align="left">
                          <Box sx={{ pt: '100%', position: 'relative' }}>
                            <StyledProductImg
                              alt={product.ProductTranslations[0].name}
                              src={config.cdnUrl + product.mainImageURL}
                            />
                          </Box>
                        </TableCell>
                        <TableCell align="left">{product.ProductTranslations[0].name}</TableCell>
                        <TableCell align="left">
                          <Box sx={{ pt: '100%', position: 'relative' }}>
                            <StyledProductImg
                              alt={product.serialImageURL}
                              src={config.apiUrl + product.serialImageURL}
                            />
                          </Box>
                        </TableCell>
                        <TableCell align="left">{product.pinCode}</TableCell>
                        <TableCell align="left">{product.active ? 'Yes' : 'No'}</TableCell>
                        <TableCell align="left">{product.status}</TableCell>
                        <TableCell align="right">
                          <IconButton
                            size="large"
                            color="inherit"
                            onClick={handleOpenMenu}
                            data-currentproduct={JSON.stringify(product)}
                          >
                            <Iconify icon={'eva:more-vertical-fill'} />
                          </IconButton>
                        </TableCell>
                        {/* <TableCell align="left">
                        <Typography
                          variant="subtitle2"
                          textTransform="uppercase"
                          color={product.status === 'sale' ? 'red' : '#33bfff'}
                        >
                          {product.status}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <ColorPreview colors={product.colors} />
                      </TableCell>
                      <TableCell>{product.priceSale === null ? '0' : product.priceSale}$</TableCell> */}
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

          <MenuItem sx={{ color: 'error.main' }}>
            <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
            Delete
          </MenuItem>
        </Popover>
      </Container>
    </>
  );
}
