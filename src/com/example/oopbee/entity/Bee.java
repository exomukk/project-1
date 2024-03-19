package com.example.oopbee.entity;

import java.util.Random;

public abstract class Bee {

    private String type;
    private int health;
    private boolean alive;

    public Bee() {
        this.health = 100;
        this.alive = true;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public int getHealth() {
        return health;
    }

    public void setHealth(int health) {
        this.health = health;

        //update status
        this.updateStatus();
    }

    public boolean isAlive(){
        return this.alive;
    }

    protected void updateStatus() {
        //update the alive status when the health value changed
        if ("Queen".equals(this.type)) {
            if (getHealth() < 20) {
                //update status is die
                this.alive = false;
            }
        } else if ("Drone".equals(this.type)) {
            if (getHealth() < 50) {
                //update status is die
                this.alive = false;
            }
        } else if ("Worker".equals(this.type)) {
            if (getHealth() < 70) {
                //update status is die
                this.alive = false;
            }
        } else {
            //nothing here
        }
    }

    //attack this bee
    public void damage() {

        // only damage alive bee
        if (this.isAlive()) {

            // Random 1 -> 100
            Random rand = new Random();
            int damageAmount = rand.nextInt(100) + 1;

            int delta = this.getHealth() - damageAmount;
            if (delta > 0) {
                //update
                this.setHealth(delta);
            } else {
                // update Health to 0
                this.setHealth(0);
            }
        }

    }

    @Override
    public String toString() {
        String beeDetails = this.getType() + "\t" + this.getHealth() + "\t" + (isAlive() == true ? "alive" : "dead");
        return beeDetails;
    }
}
