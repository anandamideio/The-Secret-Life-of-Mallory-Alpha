```mermaid
classDiagram
    class WorldCom
    WorldCom <|-- WeatherCom
    WorldCom <|-- BioCom
    BioCom <|-- PeopleCom
    BioCom <|-- FaunaCom
    BioCom <|-- FlouraCom
    FlouraCom <|-- WildFloura
    FlouraCom <|-- CultivatedFloura
    FaunaCom <|-- WildFauna
    FaunaCom <|-- DomesticatedFauna
    WorldCom <|-- BankSys
    WorldCom <|-- GovCom
    BankSys <|-- TransportCom
    BankSys <|-- ProductionCom
    BankSys <|-- RetailCom
    ProductionCom <|-- ResourceCom
    ResourceCom <|-- Mine
    Mine <|-- IronMine
    Mine <|-- AluminumMine
    Mine <|-- UraniumMine
    Mine <|-- RareMineralsMine
    ResourceCom <|-- OilWell
    OilWell <|-- DrillingRig
    OilWell <|-- DeepSeaDrillingPlatform
    OilWell <|-- UnderwaterDrillingRig
    ResourceCom <|-- LoggingCamp
    ResourceCom <|-- Farm
    ResourceCom <|-- Ranch
    Ranch <|-- CattleRanch
    Ranch <|-- PigFarm
    Ranch <|-- PoultryFarm
    Farm <|-- WheatFarm
    Farm <|-- CornFarm
    Farm <|-- SoyFarm
    Farm <|-- CoffeeFarm
    Farm <|-- PotatoeFarm
    ProductionCom <|-- FactoryCom
    ProductionCom <|-- RefineryCom
    ProductionCom <|-- EnergyPlant
    EnergyPlant <|-- LNGPowerPlant
    EnergyPlant <|-- NuclearPowerPlant
    EnergyPlant <|-- SolarFarm
    EnergyPlant <|-- WindFarm
    RefineryCom <|-- OilRefinery
    RefineryCom <|-- SteelMill
    RefineryCom <|-- IronMill
    RefineryCom <|-- LumberMill
    RefineryCom <|-- Slaughterhouse
    FactoryCom <|-- TechFactory
    TechFactory <|-- ComputerFactory
    TechFactory <|-- PhoneFactory
    TechFactory <|-- WearableFactory
    TechFactory <|-- ConsoleFactory
    FactoryCom <|-- VehicleFactory
    VehicleFactory <|-- CarFactory
    VehicleFactory <|-- TrainFactory
    VehicleFactory <|-- ShipFactory
    VehicleFactory <|-- PlaneFactory
    VehicleFactory <|-- RocketFactory
    TransportCom <|-- RoadCom
    TransportCom <|-- RailCom
    TransportCom <|-- SeaCom
    TransportCom <|-- AirCom
    TransportCom <|-- SpaceCom
    RetailCom <|-- BookShop
    RetailCom <|-- CoffeeShop
    RetailCom <|-- ComputerStore
    RetailCom <|-- GroceryStory
    RetailCom <|-- GasStation
    RetailCom <|-- Restaurant
    RetailCom <|-- CarDealership
    RetailCom <|-- InternetServiceProvider
    GovCom <|-- ExecutiveCom
    GovCom <|-- JudicaryCom
    GovCom <|-- LegislativeCom
    GovCom <|-- EduCom
    EduCom <|-- University
    EduCom <|-- Library
    ExecutiveCom <|-- MilitaryCom
    MilitaryCom <|-- MillitaryCamp
    MilitaryCom <|-- MillitaryBase
    JudiciaryCom <|-- PoliceCom

class MilitaryCamp {
  + temporary location
  + tents
  + LandingPad for VTOL SSTOs
}

class MilitaryBase {
  + permenant location
  + barracks
  + Launch Pad
  + Landing Strip
}

class ExecutiveCom {
  + Leader (President, chanceler, prime minister)
}

class CarFactory {
  + Car
  + Truck
  + Construction Equipment
}

class ShipFactory {
  + Barge
  + ContainerShip
  + Tanker
  + Bulker
}

class TrainFactory {
  + Locomotive
  + BoxCar
  + FlatCar
  + TankCar
  + PassengerCar
  + HopperCar
  + Container (20' & 40')
}

class ComputerFactory {
  + Desktop
  + Laptop
} 

class PhoneFactory {
  + SmartPhone
  + Tablet
}

class WearableFactory {
  + SmartWatch
  + SmartGlasses
}

class ConsoleFactory {
  + GameConsole
  + SmartTV
}

class OilRefinery {
  + Liquid Natural Gas
  + Fuel (gasoline, diesel)
}
```
