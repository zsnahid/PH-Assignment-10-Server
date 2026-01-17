const express = require("express");
const router = express.Router();
const equipmentController = require("../controllers/equipmentController");

// Order matters: specific routes before parameterized routes
router.get("/filter", equipmentController.getEquipmentsByFilter);
router.get("/search", equipmentController.searchEquipments);
router.get("/discounted", equipmentController.getDiscountedEquipments);
router.get("/sorted", equipmentController.getEquipmentsSorted);
router.get("/for-home", equipmentController.getEquipmentsForHome);
router.get("/category/:category", equipmentController.getEquipmentsByCategory);
router.get("/:id", equipmentController.getEquipmentById);
router.get("/", equipmentController.getEquipments);
router.post("/", equipmentController.createEquipment);
router.put("/:id", equipmentController.updateEquipment);
router.delete("/:id", equipmentController.deleteEquipment);

module.exports = router;
