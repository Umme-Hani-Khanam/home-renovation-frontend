import { useEffect, useState } from "react"
import api from "@/api/api"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function Shopping() {
  const [items, setItems] = useState([])
  const [newItem, setNewItem] = useState("")

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    const res = await api.get("/shopping")
    setItems(res.data.data || [])
  }

  const addItem = async () => {
    if (!newItem) return
    await api.post("/shopping", { name: newItem, checked: false })
    setNewItem("")
    fetchItems()
  }

  const toggleItem = async (item) => {
    await api.put(`/shopping/${item._id}`, {
      ...item,
      checked: !item.checked
    })
    fetchItems()
  }

  const deleteItem = async (id) => {
    await api.delete(`/shopping/${id}`)
    fetchItems()
  }

  return (
    <div className="space-y-10">

      <h1 className="text-3xl font-bold">Shopping List</h1>

      <div className="flex gap-4">
        <Input
          placeholder="Add new item..."
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
        />
        <Button className="bg-emerald-600 text-white" onClick={addItem}>
          Add
        </Button>
      </div>

      <div className="space-y-4">
        {items.map(item => (
          <Card key={item._id} className="rounded-xl border shadow-sm">
            <CardContent className="flex justify-between items-center py-4">

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={() => toggleItem(item)}
                  className="w-4 h-4"
                />
                <span className={item.checked ? "line-through text-gray-400" : ""}>
                  {item.name}
                </span>
              </div>

              <button
                onClick={() => deleteItem(item._id)}
                className="text-red-600 text-sm"
              >
                Delete
              </button>

            </CardContent>
          </Card>
        ))}
      </div>

    </div>
  )
}