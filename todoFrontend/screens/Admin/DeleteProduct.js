import React, { useEffect, useState } from 'react';
import { View, FlatList, Alert } from 'react-native';
import { List, IconButton, Dialog, Button } from 'react-native-paper';

const DeleteProduct = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [dialogVisible, setDialogVisible] = useState(false);

  useEffect(() => {
    // Fetch products from API
    // Set products using setProducts
  }, []);

  const handleDeleteIconPress = (product) => {
    setSelectedProduct(product);
    setDialogVisible(true);
  };

  const handleDeleteConfirmed = () => {
    // Call API to delete product
    // After successful deletion, update products state
    setDialogVisible(false);
  };

  const renderProductItem = ({ item }) => (
    <List.Item
      title={item.name}
      description={`Category: ${item.category}, Price: ${item.price}`}
      right={() => (
        <IconButton
          icon="delete"
          onPress={() => handleDeleteIconPress(item)}
        />
      )}
    />
  );

  return (
    <View>
      <FlatList
        data={products}
        renderItem={renderProductItem}
        keyExtractor={(item) => item.id.toString()}
      />

      <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
        <Dialog.Title>Delete Product</Dialog.Title>
        <Dialog.Content>
          <Dialog.Paragraph>
            Are you sure you want to delete this product?
          </Dialog.Paragraph>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={handleDeleteConfirmed}>Yes</Button>
          <Button onPress={() => setDialogVisible(false)}>No</Button>
        </Dialog.Actions>
      </Dialog>
    </View>
  );
};

export default DeleteProduct;
