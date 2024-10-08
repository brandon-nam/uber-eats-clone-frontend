import React, { useState } from "react";
import { Header } from "../../components/header";
import { PageHeading } from "../../components/page-heading";
import { gql } from "../../__generated__";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { CreateOrderInput, CreateOrderItemInput, Dish, DishOption, RestaurantQuery, RestaurantQueryVariables } from "../../__generated__/graphql";
import { MenuSidebar } from "../../components/menu-sidebar";
import { DishComponent } from "../../components/dish";
import { DisplayedItem } from "../../components/cart";
import { displayedItemsVar, orderItemsVar, restaurantIdVar } from "../../apollo";

const RESTAURANT_QUERY = gql(`
    query restaurant($input: RestaurantInput!) {
        restaurant(input: $input) {
            ok
            error
            restaurant {
                id
                name
                coverImage
                category {
                    name
                }
                address
                menu {
                    id
                    name
                    price
                    photo
                    description
                    options {
                        name
                        extra
                        choices {
                            name
                            extra
                        }
                    }
                }
            }
        }
    }
`);


export const Restaurant = () => {
    const params = useParams<{ id: string }>();
    const restaurantId = params.id ? +params.id : 0;
    if (restaurantId) {
        restaurantIdVar(restaurantId); 
    }

    const [isOpen, setIsOpen] = useState(false);
    const [option, setOption] = useState([]);
    const [selectedDish, setSelectedDish] = useState<Dish>();

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const setOrderItemsArray = (orderItem: CreateOrderItemInput) => {
        const orderItems = orderItemsVar(); 
        orderItemsVar([...orderItems, orderItem]); 
    }

    const setDisplayedItemsArray = (orderItem: DisplayedItem) => {
        const displayedItems = displayedItemsVar(); 
        displayedItemsVar([...displayedItems, orderItem]);
    }

    const { data, loading, error } = useQuery<RestaurantQuery, RestaurantQueryVariables>(RESTAURANT_QUERY, {
        variables: {
            input: {
                id: restaurantId,
            },
        },
    });
    const restaurantData = data?.restaurant.restaurant;

    const onDishClick = (dish: any) => {
        toggleSidebar();
        setOption(dish.options);
        setSelectedDish(dish);
    };

    return (
        <>
            <Header transparent={false} />
            <div>
                <PageHeading text={restaurantData?.name} />
                <MenuSidebar options={option} isOpen={isOpen} toggleSidebar={toggleSidebar} dish={selectedDish} setOrderItem={setOrderItemsArray} setDisplayedItem={setDisplayedItemsArray} />
                <div
                    className={`fixed inset-0 bg-black ${
                        isOpen ? "opacity-20 pointer-events-auto" : "opacity-0 pointer-events-none"
                    } transition-opacity duration-300 ease-in-out z-30`}
                    onClick={toggleSidebar}
                />
                <h2 className="w-full max-w-custom-xl mx-auto px-3 md:px-5 mb-3">{restaurantData?.category?.name}</h2>
                <h2 className="w-full max-w-custom-xl mx-auto px-3 md:px-5">{restaurantData?.address}</h2>
            </div>
            <div className="mt-10">
                {data?.restaurant.restaurant?.menu?.length === 0 ? (
                    <h4 className="text-xl mb-5">Please upload a dish!</h4>
                ) : (
                    <div className="grid mt-16 md:grid-cols-3 gap-x-5 gap-y-10">
                        {data?.restaurant.restaurant?.menu?.map((dish) => (
                            <DishComponent
                                onClick={() => onDishClick(dish)}
                                name={dish.name}
                                description={dish.description}
                                price={dish.price}
                                photo={dish.photo}
                            />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};
