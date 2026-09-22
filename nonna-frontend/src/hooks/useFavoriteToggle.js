import { useCallback } from "react";

export default function useFavoriteToggle(orders, setOrders, token) {

  const toggleFavorite = useCallback(async (orderId, dishId) => {
    let newValue;

    const updatedOrders = orders.map(order => {
      if (order.dishes) {
        if (order.id !== orderId) return order;

        const updatedDishes = order.dishes.map(dish => {
          if (dish.id !== dishId) return dish;

          // switch favorite value true/false and store it
          newValue = !dish.isFavorite;
          return { ...dish, isFavorite: newValue };
        });

        return { ...order, dishes: updatedDishes };
      }

      if (order.id === dishId) {
        newValue = !order.isFavorite;
        return { ...order, isFavorite: newValue };
      }

      return order;
    });

    if (newValue === undefined) {
      return;
    }

    const previousOrders = orders;
    setOrders(updatedOrders);

    try {
      const response = await fetch(
        `http://localhost:8080/dishes/${dishId}/favorite`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ isFavorite: newValue })
        }
      );

      if (!response.ok) {
        setOrders(previousOrders);
      }
    } catch {
      // Network error — roll back update
      setOrders(previousOrders);
    }
  }, [orders, setOrders, token]);

  return { toggleFavorite };
}
