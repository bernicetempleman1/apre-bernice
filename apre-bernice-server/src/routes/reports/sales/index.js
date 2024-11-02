/**
 * Author: Professor Krasso
 * Date: 8/14/24
 * File: index.js
 * Description: Apre sales report API for the sales reports
 */

"use strict";



const express = require('express');
const { mongo } = require('../../../utils/mongo');
const createError = require('http-errors');

const router = express.Router();

/**
 * @description
 *
 * GET /regions
 *
 * Fetches a list of distinct sales regions.
 *
 * Example:
 * fetch('/regions')
 *  .then(response => response.json())
 *  .then(data => console.log(data));
 */
router.get("/regions", (req, res, next) => {
  try {
    mongo(async (db) => {
      const regions = await db.collection("sales").distinct("region");
      res.send(regions);
    }, next);
  } catch (err) {
    console.error("Error getting regions: ", err);
    next(err);
  }
});

/**
 * @description
 *
 * GET /regions/:region
 *
 * Fetches sales data for a specific region, grouped by salesperson.
 *
 * Example:
 * fetch('/regions/north')
 *  .then(response => response.json())
 *  .then(data => console.log(data));
 */
router.get("/regions/:region", (req, res, next) => {
  try {
    mongo(async (db) => {
      const salesReportByRegion = await db
        .collection("sales")
        .aggregate([
          { $match: { region: req.params.region } },
          {
            $group: {
              _id: "$salesperson",
              totalSales: { $sum: "$amount" },
            },
          },
          {
            $project: {
              _id: 0,
              salesperson: "$_id",
              totalSales: 1,
            },
          },
          {
            $sort: { salesperson: 1 },
          },
        ])
        .toArray();
      res.send(salesReportByRegion);
    }, next);
  } catch (err) {
    console.error("Error getting sales data for region: ", err);
    next(err);
  }
});

/**
 * @description
 *
 * GET /years/:year
 *
 * Fetches sales data for a specific year, grouped by salesperson.
 *
 * Example:
 * fetch('/years/2023')
 *  .then(response => response.json())
 *  .then(data => console.log(data));
 *
 * {$match: {$expr: {$eq: [2008, {$year: "$date"}] } } }
 */

router.get("/sales-by-year", (req, res, next) => {
  try {
    const { year } = req.query;

    if (!year) {
      return next(createError(400, "year is required"));
    }

    mongo(async (db) => {
      const data = await db
        .collection("sales")
        .aggregate([


          /*********this shows each salesperson's total sales
          { $match: { year: req.params.year } },
      {$match: {$expr: {$eq: [year, {$year: "$date"}] } } }
          {
            $group: {
              _id: "$salesperson",
              totalSales: { $sum: "$amount" },
            },
          },
          {
            $project: {
              _id: 0,
              salesperson: "$_id",
              totalSales: 1,
            },
          },
          {
            $sort: { salesperson: 1 },
          },
        ])
        .toArray();

        /*********end: this shows each salesperson's total sales */


/******this works
          {
            $group: {
              _id: {
                salesperson: '$salesperson',
                year: { $year: "$date" },
              },
              totalSales: { $sum: "$amount" },
            }
          },

              { $match: { '_id.year': Number(year) } },



        {
          $project: {
            _id: 0,
            salesperson: "$_id.salesperson",
            totalSales: 1
          },
        },
        {
          $group: {
            _id: null,
            salesperson: { $push: '$salesperson' },
            totalSales: { $push: '$totalSales' }
          }
        },
        {
          $sort: { salesperson: 1 },
        },

        end this works */


        {
          $group: {
            _id: {
              salesperson: '$salesperson',
              year: { $year: "$date" },
            },
            totalSales: { $sum: "$amount" },
          }
        },

            { $match: { '_id.year': Number(year) } },



      {
        $project: {
          _id: 0,
          salesperson: "$_id.salesperson",
          totalSales: 1
        },
      },
  
      {
        $sort: { salesperson: 1 },
      },

/*
          {
            $project: {

              _id: 0,
            salesperson: '$_id',
            totalSales: 1
            },
          },
          {
            $group: {
              _id: null,
              salesperson: { $push: '$salesperson' },
              totalSales: { $push: '$totalSales' }
            }
          },
          {
            $sort: { salesperson: 1 },
          },
          */
             ]).toArray();









          /*
          {
            $group: {
              _id: {
              salesperson: "$salesperson",
              year: { $year: "$date" },
              },
              totalSales: { $sum: "$amount" },
            },
          },


          {
            $group: {
              _id: '$_id.salesperson',
              totalSales: { $push: '$totalSales' }
            }
          },







          {
            $project: {
              _id: 0,
              salesperson: '$_id',
              totalSales: 1
            }
          },
          {
            $group: {
              _id: null,
              salesperson: { $push: '$salesperson' },
              totalSales: { $push: '$totalSales' }
            }
          },
          {
            $project: {
              _id: 0,
              salesperson: 1,
              totalSales: 1
            }
          }


 { $match: { region: req.params.region } },
          {
            $group: {
              _id: "$salesperson",
              totalSales: { $sum: "$amount" },
            },
          },
          {
            $project: {
              _id: 0,
              salesperson: "$_id",
              totalSales: 1,
            },
          },
          {
            $sort: { salesperson: 1 },
          },
        ])





*/

      res.send(data);
    }, next);
  } catch (err) {
    console.error("Error getting sales data for year: ", err);
    next(err);
  }
});

module.exports = router;



/*




{
            $project: {
              _id: 0,
              totalSales: 1,
            },
          },
          {
            $sort: { _id: 1 },
          },
        ])




      {
          $addFields: {
            date: { $toDate: '$date' }
          }
        },
        {
          $group: {
            _id: {
              channel: "$channel",
              month: { $month: "$date" },
            },
            ratingAvg: { $avg: '$rating'}
          }
        },
        {
          $match: {
            '_id.month': Number(month)
          }
        },
        {
          $group: {
            _id: '$_id.channel',
            ratingAvg: { $push: '$ratingAvg' }
          }
        },
        {
          $project: {
            _id: 0,
            channel: '$_id',
            ratingAvg: 1
          }
        },
        {
          $group: {
            _id: null,
            channels: { $push: '$channel' },
            ratingAvg: { $push: '$ratingAvg' }
          }
        },
        {
          $project: {
            _id: 0,
            channels: 1,
            ratingAvg: 1
          }
        }
          */