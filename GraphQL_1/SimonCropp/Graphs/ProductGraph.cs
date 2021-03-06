﻿using GraphQL.EntityFramework;
using GraphQL.Types;
using GraphQL_1.Data;
using GraphQL_1.Models;
using System.Linq;

namespace GraphQL_1.SimonCropp.Graphs
{
    public class ProductGraph :
    EfObjectGraphType<AppDbContext, Product>
    {
        public ProductGraph(IEfGraphQLService<AppDbContext> graphQlService) :
            base(graphQlService)
        {
            Field(x => x.ProductId);     //Field("ids", x => x.ProductId);
            Field(x => x.Name).Description("Name of Product");
            Field(x => x.ProductNumber);
            Field(x => x.MakeFlag, nullable: true);
            Field(x => x.FinishedGoodsFlag, nullable: true);
            Field(x => x.Color, nullable: true);
            //Field(x => x.SafetyStockLevel, type: typeof(ShortGraphType));     // Known problem with GraphQl-DotNet and ShortGraphType
            //Field(x => x.ReorderPoint, type: typeof(ShortGraphType));         // Known problem with GraphQl-DotNet and ShortGraphType
            Field(x => x.StandardCost, type: typeof(DecimalGraphType));
            Field(x => x.ListPrice, type: typeof(DecimalGraphType));
            Field(x => x.Size, nullable: true);
            Field(x => x.SizeUnitMeasureCode).Description("Property of UnitMeasureType --> InverseProperty");
            Field(x => x.WeightUnitMeasureCode).Description("Property of UnitMeasureType --> InverseProperty");
            Field(x => x.Weight, nullable: true, type: typeof(DecimalGraphType));
            Field(x => x.DaysToManufacture);
            Field(x => x.ProductLine);
            Field(x => x.Class);
            Field(x => x.Style);
            Field(x => x.SellStartDate);
            Field(x => x.SellEndDate, nullable: true);
            Field(x => x.DiscontinuedDate, nullable: true);
            Field(x => x.Rowguid, type: typeof(IdGraphType));
            Field(x => x.ModifiedDate);
            //Aggregation by TransactionType
            Field("AggOfTransactionHistoryByTypeW", x => x.TransactionHistory.Where(th => th.ProductId == x.ProductId && th.TransactionType == "W").Select(th => th.Quantity).Aggregate(0, (res, item) => res + item));
            Field("AggOfTransactionHistoryByTypeS", x => x.TransactionHistory.Where(th => th.ProductId == x.ProductId && th.TransactionType == "S").Select(th => th.Quantity).Aggregate(0, (res, item) => res + item));
            Field("AggOfTransactionHistoryByTypeP", x => x.TransactionHistory.Where(th => th.ProductId == x.ProductId && th.TransactionType == "P").Select(th => th.Quantity).Aggregate(0, (res, item) => res + item));
            //Overall Aggregation
            //Field("AggOfTransactionHistoryByType", x => x.TransactionHistory.Select(th => th.Quantity).Aggregate((res, item) => res + item));
            //Count by TransactionType
            //Field("CountOfTransactionHistoryByTypeW", x => x.TransactionHistory.Where(th => th.TransactionType == "W").Count());
            //Field("CountOfTransactionHistoryByTypeS", x => x.TransactionHistory.Where(th => th.TransactionType == "S").Count());
            //Field("CountOfTransactionHistoryByTypeP", x => x.TransactionHistory.Where(th => th.TransactionType == "P").Count());
            AddNavigationListField(
                name: "productReview",
                resolve: context => context.Source.ProductReview);
            AddNavigationConnectionField(
                name: "productReviewConnection",
                resolve: context => context.Source.ProductReview,
                includeNames: new[] { "ProductReview" });
            AddNavigationListField(
                name: "transactionHistory",
                resolve: context => context.Source.TransactionHistory);
            AddNavigationConnectionField(
                name: "transactionHistoryConnection",
                resolve: context => context.Source.TransactionHistory,
                includeNames: new[] { "TransactionHistory" });
            AddNavigationField(
                name: "ProductSubcategory",
                resolve: context => context.Source.ProductSubcategory);

            // ###############
            // Original Types from GraphQL for .NET
            // ###############
            ////Field<ProductModelType>(nameof(Product.ProductModel)/*, nullable: true*/);
            ////Field<UnitMeasureType>(nameof(Product.SizeUnitMeasureCode)/*, nullable: true*/);
            ////Field<UnitMeasureType>(nameof(Product.WeightUnitMeasureCode)/*, nullable: true*/);
            
        }
    }
}
