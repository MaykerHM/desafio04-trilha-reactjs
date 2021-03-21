import { useEffect, useState } from 'react'

import { FoodType } from '../../types'

import { Header } from '../../components/Header'
import api from '../../services/api'
import { Food } from '../../components/Food'
import { ModalAddFood } from '../../components/ModalAddFood'
import { ModalEditFood } from '../../components/ModalEditFood'
import { FoodsContainer } from './styles'

export function Dashboard() {
  const [foods, setFoods] = useState<FoodType[]>([])
  const [editingFood, setEditingFood] = useState<FoodType>()
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false)


  useEffect(() => {
    async function getFoods() {
      const response = await api.get('/foods')
      setFoods(response.data)
    }
    getFoods()
  }, [])


  const handleAddFood = async (food: FoodType) => {

    try {
      const response = await api.post('/foods', {
        ...food,
        available: true,
      })

      setFoods(foods => [...foods, response.data])
    } catch (err) {
      console.log(err)
    }
  }

  const handleUpdateFood = async (food: FoodType) => {

    try {
      if (editingFood) {
        const foodUpdated = await api.put(`/foods/${editingFood.id}`, {
          ...editingFood,
          ...food,
        })

        const foodsUpdated = foods.map((f) =>
          f.id !== foodUpdated.data.id ? f : foodUpdated.data
        )

        setFoods(foodsUpdated)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const handleDeleteFood = async (id: string) => {

    await api.delete(`/foods/${id}`)

    const foodsFiltered = foods.filter((food) => food.id !== id)

    setFoods(foodsFiltered)
  }

  const toggleModal = () => {

    setModalOpen(!modalOpen)
  }

  const toggleEditModal = () => {

    setEditModalOpen(!editModalOpen)
  }

  const handleEditFood = (food: FoodType) => {
    setEditModalOpen(true)
    setEditingFood(food)
  }


  return (
    <>
      <Header openModal={ toggleModal } />
      <ModalAddFood
        isOpen={ modalOpen }
        setIsOpen={ toggleModal }
        handleAddFood={ handleAddFood }
      />
      <ModalEditFood
        isOpen={ editModalOpen }
        setIsOpen={ toggleEditModal }
        editingFood={ editingFood }
        handleUpdateFood={ handleUpdateFood }
      />

      <FoodsContainer data-testid='foods-list'>
        { foods &&
          foods.map((food: FoodType) => (
            <Food
              key={ food.id }
              food={ food }
              handleDelete={ handleDeleteFood }
              handleEditFood={ handleEditFood }
            />
          )) }
      </FoodsContainer>
    </>
  )
}